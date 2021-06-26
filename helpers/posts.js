const postModel = require("../models/post");
const commentModel = require("../models/comment");
const studentModel = require("../models/student");
const clubModel = require("../models/club");
const { getPostsPage, getComments } = require("../helpers/postsPagination");
const { decodeToken } = require("../helpers/utils");
const jwt = require("jsonwebtoken");
const MongoPaging = require("mongo-cursor-pagination");

exports.createPosts = async function (req, res, next) {
  const { title, body, timestamp, tags, accountType } = req.body;

  // pull email from jwt
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token, { complete: true });
  let id = decoded.payload.id;
  let email = decoded.payload.email;

  // save post to db
  const post = new postModel({
    title,
    body,
    timestamp: new Date(),
    tags,
    authorEmail: email,
    authorName: decoded.payload.name,
    likes: 0,
  });

  try {
    await post.save();
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }

  // save post._id to the user record
  if (accountType == "student") {
    try {
      let user = await studentModel.findOneAndUpdate(
        { _id: id },
        {
          $push: { posts: post._id },
        }
      );
      console.log("student user found", user);
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  } else {
    try {
      let user = await clubModel.findOne({ _id: id });
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
    post,
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

    return res.status(200).json({
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
  const { authorEmail, post_id, commentBody } = req.body;
  try {
    const comment = new commentModel({
      postID: post_id,
      author: authorEmail,
      body: commentBody,
      timestamp: new Date(),
    });
    await comment.save();

    let post = await postModel.findById(post_id);
    await post.updateOne({ $push: { comments: comment._id } });
    return res.status(201).json({
      message: "Added Comments",
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.getPosts = async function (req, res, next) {
  const { limit, nextPage, previousPage, userType } = req.query;
  const reachedEnd = req.body.reachedEnd;
  const email = decodeToken(req).email;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token, { complete: true });
    let sID = decoded.payload.id;
    const { tags, clubs } = await studentModel.findById(sID, "tags clubs");
    const paginatedPosts = await getPostsPage(
      res,
      limit,
      nextPage,
      previousPage,
      tags,
      clubs,
      reachedEnd,
      email,
      userType
    );

    return res.status(200).json({
      message: "Posts successfully queried.",
      paginatedPosts,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.addPostLike = async function (req, res) {
  const { authorEmail, post_id } = req.body;
  resMessage = "";
  try {
    let post = await postModel.findById(post_id);
    likedUsers = await post.get("userLikes");

    if (!likedUsers.includes(authorEmail)) {
      await post.updateOne({ $inc: { likes: 1 } }, { new: true });
      await post.updateOne({ $push: { userLikes: authorEmail } });
      resMessage = "incremented post like";
    } else {
      resMessage = "User already liked.";
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

exports.getPostLikes = async function (req, res, next) {
  const { post_id } = req.body;

  try {
    let post = await postModel.findById(post_id);
    likes = post.get("likes");
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
  const { accountType, post_id } = req.body;

  const payload = decodeToken(req);
  let id = payload.id;

  if (accountType == "student") {
    // student saved posts
    try {
      let user = await studentModel.findOne({ _id: id });
      if (user.savedPosts.includes(post_id)) {
        // if post is already saved, unsave it
        await user.updateOne({ $pull: { savedPosts: post_id } });
        res.status(201).json({
          message: "student: removed post to saved post",
        });
      } else {
        // else save the post
        await user.updateOne({ $push: { savedPosts: post_id } });
        res.status(201).json({
          message: "student: added post from saved post",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: err,
      });
    }
  } else {
    // get club saved posts
    try {
      let user = await clubModel.findOne({ _id: id });
      if (user.savedPosts.includes(post_id)) {
        // post is already saved, unsave it
        await user.updateOne({ $pull: { savedPosts: post_id } });
        res.status(201).json({
          message: "club: removed post to saved post",
        });
      } else {
        // else save the post
        await user.updateOne({ $push: { savedPosts: post_id } });
        res.status(201).json({
          message: "club: added post to saved post",
        });
      }
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }
};

exports.getSavedPosts = async function (req, res) {
  // return array of posts
  const accountType = req.query.accountType;

  const payload = decodeToken(req);
  let id = payload.id;

  if (accountType == "student") {
    try {
      //let user = await studentModel.findOne({ _id: id });
      //posts = user.get("savedPosts");
      posts = await studentModel.find({ _id: id }, { savedPosts: 1 });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res.status(200).json({
      message: "Student Saved Posts successfully queried.",
      posts,
    });
  } else {
    try {
      // let user = await clubModel.findOne({ _id: id });
      // posts = user.get("savedPosts");
      posts = await clubModel.find({ _id: id }, { savedPosts: 1 });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res.status(200).json({
      message: "Club Saved Posts successfully queried.",
      posts,
    });
  }
};

// GET
// req body: user's email
// returns: post IDs of posts authored by user
exports.getPostsbyUser = async function (req, res) {
  const { accountType } = req.query;
  const payload = decodeToken(req);
  let id = payload.id;

  if (accountType == "student") {
    try {
      let user = await studentModel.findOne({ _id: id });
      let posts = await user.get("posts");
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
        id,
      });
      let posts = await user.get("posts");
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

exports.getPostComments = async function (postID, limit, nextPage, prevPage) {
  try {
    const result = MongoPaging.find(commentModel.collection, {
      query: {
        postID: postID,
      },
      paginatedField: "timestamp",
      limit: parseInt(limitNum),
      sortAscending: false,
      next: nextPage,
      previous: prevPage,
    });
    return result;
  } catch (err) {
    res.send({ message: err.message });
  }
};
