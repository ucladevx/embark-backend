const postModel = require("../models/post");
const { getPostsPage } = require("../helpers/postsPagination");
const studentModel = require("../models/student");
const clubModel = require("../models/club");
const jwt = require("jsonwebtoken");

exports.createPosts = async function (req, res, next) {
  const { title, body, timestamp, tags, accountType } = req.body;

  // pull email from jwt
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token, { complete: true });
  let email = decoded.payload.email;
  console.log("Request made from:", email);

  // save post to db
  const post = new postModel({
    title,
    body,
    timestamp: new Date(),
    tags,
    authorEmail: email,
    likes: 0,
  });

  try {
    await post.save();
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }

  // save post._id to the user record
  if (accountType == "student") {
    try {
      let user = await studentModel.findOne({ email });
      console.log("student user found", user);
      user.posts.push(post._id);
      await user.save();
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  } else {
    try {
      let user = await clubModel.findOne({ email });
      console.log("club user found", user);
      user.posts.push(post._id);
      await user.save();
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }

  // also return email of author here.
  res.status(201).json({
    message: "Post successfully created.",
    title,
    body,
    timestamp,
    tags,
    email,
    _id: post._id,
  });
};

exports.getPosts = async function (req, res, next) {
  // for now, accept tags and clubs to filter by
  //const { tags, clubs } = req.body //change to req.query

  const { limit, nextPage, previousPage } = req.query;
  // const {tags,clubs}=req.query;

  // pull userEmail/clubEmail from jwt to get tags + clubs for that user/club alone
  // pass those to the query below

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token, { complete: true });
    let sID = decoded.payload.id;
    const { tags, clubs } = await studentModel.findById(sID, "tags clubs");

    const paginatedPosts = await getPostsPage(
      limit,
      nextPage,
      previousPage,
      tags,
      clubs
    );

    res.status(200).json({
      message: "Posts successfully queried.",
      paginatedPosts,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.addPostComment = async function (req, res) {
  const { authorEmail, post_id, comment } = req.body;
  try {
    let post = await postModel.findById(post_id);
    await post.get("comments").push({
      authorEmail: authorEmail,
      body: comment,
      date: new Date(),
    });
    await post.save();
    comments = post.get("comments");
    res.status(201).json({
      message: "Added Comments",
      comments,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.getPostComments = async function (req, res, next) {
  const { post_id } = req.body;
  try {
    let post = await postModel.findById(post_id);
    comments = post.get("comments");
    console.log("comments", comments);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(200).json({
    message: "Get post comments",
    comments,
  });
};

exports.addPostLike = async function (req, res) {
  const { authorEmail, post_id } = req.body;
  resMessage = "";
  try {
    let post = await postModel.findById(post_id);
    likedUsers = await post.get("userLikes");

    console.log(likedUsers.includes(authorEmail));
    // console.log(post.get('authorEmail'))
    // console.log(authorEmail)
    if (!likedUsers.includes(authorEmail)) {
      post = await postModel.findByIdAndUpdate(post_id, { $inc: { likes: 1 } });
      likes = post.get("likes");
      console.log("likes", likes);

      await post.get("userLikes").push(authorEmail);

      await post.save();
      resMessage = "incremented post like";
    } else {
      console.log("User already liked.");
      resMessage = "User already liked.";
    }
    res.status(201).json({
      message: resMessage,
      post,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.getPostLikes = async function (req, res, next) {
  const { post_id } = req.body;
  // console.log(post_id);
  try {
    let post = await postModel.findById(post_id);
    likes = post.get("likes");
    console.log("likes", likes);
    res.status(200).json({
      message: "Likes for post queried",
      likes,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.savePost = async function (req, res) {
  // add postid to saved posts field for student + club
  const { email, accountType, post_id } = req.body;

  if (accountType == "student") {
    try {
      let user = await studentModel.findOne({ email });
      user.savedPosts.push(post_id);
      await user.save();
      res.status(201).json({
        message: "student created saved post",
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  } else {
    // get club saved posts
    try {
      let user = await clubModel.findOne({ email });
      user.savedPosts.push(post_id);
      await user.save();
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    res.status(201).json({
      message: "club created saved post",
    });
  }
};

exports.getSavedPosts = async function (req, res) {
  // return array of posts
  const email = req.body.email;
  const accountType = req.body.accountType;
  if (accountType == "student") {
    try {
      let user = await studentModel.findOne({ email });
      posts = user.get("savedPosts");
      console.log("savedPosts", posts);
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    res.status(200).json({
      message: "Student Saved Posts successfully queried.",
      posts,
    });
  } else {
    try {
      let user = await clubModel.findOne({ email });
      posts = user.get("savedPosts");
      console.log("savedPosts", posts);
      res.status(200).json({
        message: "Club Saved Posts successfully queried.",
        posts,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }
};

// GET
// req body: user's email
// returns: post IDs of posts authored by user
exports.getPostsbyUser = async function (req, res) {
  const { accountType, userEmail } = req.body;
  if (accountType == "student") {
    try {
      let user = await studentModel.findOne({
        email: userEmail,
      });
      let posts = await user.get("posts");
      console.log("authoredPosts: ", posts);
      res.status(200).json({
        message: "Student authored posts successfully queried.",
        posts,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  } else {
    try {
      let user = await clubModel.findOne({
        email: userEmail,
      });
      let posts = await user.get("posts");
      console.log("authoredPosts: ", posts);
      res.status(200).json({
        message: "Club authored posts successfully queried.",
        posts,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }
};

exports.removePostLike = async function (req, res, next) {
  const { post_id, userType } = req.body;
  const email = decodeToken(req).email;
  let user = findUser(email, userType);
  if (user === -1) {
    return res.status(404).json({
      message: `Could not find user with email ${email}`,
    });
  }
  resMessage = "";

  try {
    let post = await postModel.findById(post_id);
    likedUsers = await post.get("userLikes");

    if (!likedUsers.includes(email)) {
      //decrement post like
      post = await postModel.findByIdAndUpdate(post_id, {
        $inc: { likes: -1 },
      });
      //remove like user's email from the post's userLikes
      let updatedPostLikes = await post.get("userLikes");
      let postIndex = updatedPostLikes.indexOf(email);
      let removed =
        postIndex > -1 ? updatedPostLikes.splice(postIndex, 1) : false;
      if (removed) {
        post.userLikes = updatedPostLikes;
        await post.save();
      }

      //remove post id from user's likedPosts
      let updatedUserLikes = user.get("likedPosts");
      let userIndex = updatedUserLikes.indexOf(post._id);
      if (userIndex) {
        user.likedPosts = updatedUserLikes.splice(userIndex, 1);
        await user.save();
      }
      resMessage = "User unliked the post";
    } else {
      resMessage = "User has not liked post yet";
    }
    return res.status(201).json({
      message: resMessage,
      post,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.removePostComment = async function (req, res, next) {
  const { post_id, comment_id, userType } = req.body;

  const email = decodeToken(req).email;
  let user = findUser(email, userType, res);
  if (user === -1) {
    return res.status(404).json({
      message: `Could not find user with email ${email}`,
    });
  }

  try {
    //remove comment from post
    let post = await postModel.findById(post_id);
    let updatedPostComments = await post.get("comments");
    post.comments = updatedPostComments.push({
      authorEmail: email,
      body: comment,
      date: new Date(),
    });
    await post.save();

    //remove comment from user's comments
    if (!user.get("commentedPosts").includes(post._id)) {
      user.commentedPosts = user.get("commentedPosts").push(post._id);
      await user.save();
    }

    comments = post.get("comments");
    return res.status(201).json({
      message: "Added Comments",
      comments,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};
