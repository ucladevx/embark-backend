const postModel = require('../models/post');
const studentModel = require('../models/student');
const clubModel = require('../models/club');
const { getPostsPage } = require("../helpers/postsPagination")
const jwt = require("jsonwebtoken")
const { decodeToken } = require('../helpers/utils');
//const { post } = require('../routes/posts') <- this creates a circular dependency 

exports.createPosts = async function (req, res, next) {
    const { title, body, timestamp, tags } = req.body

    // pull email from jwt
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token, { complete: true });
    let email = decoded.payload.email;
    console.log('Request made from:', email)

    // save post to db
    const post = new postModel({
        title,
        body,
        timestamp: new Date(),
        tags,
        authorEmail: email,
        likes: 0,
    })

    try {
        await post.save()
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

    // save post._id to the user record
    try {
        let user = await studentModel.findOne({ email })
        console.log('user found', user)
        user.posts.push(post._id)
        await user.save()
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    // also return email of author here.
    res.status(201).json({
        message: "Post successfully created.",
        title,
        body,
        timestamp,
        tags,
        email,
        _id: post._id
    })
}

async function findUser(email, userType) {
    try {
        if (userType === "student") {
            return await studentModel.findOne({ email: email });
        } else if (userType === "club") {
            return await clubModel.findOne({ email: email });
        } else {
            return -1;
        }
    } catch (err) {
        return -1;
    }
}
exports.getPosts = async function (req, res, next) {
    // for now, accept tags and clubs to filter by
    //const { tags, clubs } = req.body //change to req.query

    const { limit, nextPage, previousPage, userType } = req.query;
    const reachedEnd = req.body.reachedEnd;
    // const {tags,clubs}=req.query;

    // pull userEmail/clubEmail from jwt to get tags + clubs for that user/club alone
    // pass those to the query below
    const email = decodeToken(req).email;
    try {

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.decode(token, { complete: true });
        let sID = decoded.payload.id;
        const { tags, clubs } = await studentModel.findById(sID, 'tags clubs');

        const paginatedPosts = await getPostsPage(res, limit, nextPage, previousPage, tags, clubs, reachedEnd, email, userType);

        return res.status(200).json({
            message: "Posts successfully queried.",
            paginatedPosts
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
}

exports.addPostComment = async function (req, res) {
    const { post_id, comment, userType } = req.body;

    const email = decodeToken(req).email;
    let user = findUser(email, userType, res);
    if (user === -1) {
        return res.status(404).json({
            message: `Could not find user with email ${email}`
        });
    }

    try {
        //save comment to post
        let post = await postModel.findById(post_id);
        let updatedPostComments = await post.get('comments');
        post.comments = updatedPostComments.push({
            authorEmail: email,
            body: comment,
            date: new Date(),
        });
        await post.save();

        //save comment to user's comments
        if (!user.get('commentedPosts').includes(post._id)) {
            user.commentedPosts = user.get('commentedPosts').push(post._id);
            await user.save();
        }

        comments = post.get('comments');
        res.status(201).json({
            message: "Added Comments",
            comments
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
}

exports.getPostComments = async function (req, res, next) {
    const { post_id } = req.body
    try {
        let post = await postModel.findById(post_id);
        comments = post.get('comments');
        console.log('comments', comments)
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    res.status(200).json({
        message: "Get post comments",
        comments
    })
}
exports.addPostLike = async function (req, res) {

    const { post_id, userType } = req.body
    const email = decodeToken(req).email;
    let user = findUser(email, userType);
    if (user === -1) {
        return res.status(404).json({
            message: `Could not find user with email ${email}`
        });
    }
    resMessage = ""

    try {
        let post = await postModel.findById(post_id);
        likedUsers = await post.get('userLikes');

        if (!likedUsers.includes(email)) {
            //increment post like
            post = await postModel.findByIdAndUpdate(
                post_id,
                { $inc: { 'likes': 1 } }
            )
            //add like user's email to the post's userLikes
            let updatedUserLikes = await post.get('userLikes');
            post.userLikes = updatedUserLikes.push(email);
            await post.save();

            //add post id to user's likedPosts
            if (!user.get('likedPosts').includes(post._id)) {
                user.likedPosts = user.get('likedPosts').push(post._id);
                await user.save();
            }
            resMessage = "incremented post like"
        } else {
            resMessage = "User already liked."
        }
        res.status(201).json({
            message: resMessage,
            post
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
}

exports.getPostLikes = async function (req, res, next) {
    const { post_id } = req.body
    // console.log(post_id);
    try {
        let post = await postModel.findById(post_id);
        likes = post.get('likes');
        console.log('likes', likes)
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
}


exports.savePost = async function (req, res) {
    // add postid to saved posts field for student + club
    const { email, accountType, post_id } = req.body

    if (accountType == "student") {
        try {
            let user = await studentModel.findOne({ email })
            user.savedPosts.push(post_id)
            await user.save()
            res.status(201).json({
                message: "student created saved post",
            })
        } catch (err) {
            return res.status(400).json({
                message: err.message
            })
        }
    } else { // get club saved posts
        try {
            let user = await clubModel.findOne({ email })
            user.savedPosts.push(post_id)
            await user.save()
        } catch (err) {
            return res.status(400).json({
                message: err.message
            })
        }
        res.status(201).json({
            message: "club created saved post",
        })
    }
}

exports.getSavedPosts = async function (req, res, next) {
    // return array of posts
    const email = req.body.email;
    const accountType = req.body.accountType;
    if (accountType == "student") {
        try {
            let user = await studentModel.findOne({ email })
            posts = user.get('savedPosts');
            console.log('savedPosts', posts)
        } catch (err) {
            return res.status(400).json({
                message: err.message
            })
        }
        res.status(200).json({
            message: "Student Saved Posts successfully queried.",
            posts
        })
    } else {
        try {
            let user = await clubModel.findOne({ email })
            posts = user.get('savedPosts');
            console.log('savedPosts', posts)
            res.status(200).json({
                message: "Club Saved Posts successfully queried.",
                posts
            })
        } catch (err) {
            return res.status(400).json({
                message: err.message
            })
        }
    }
}
