const postModel = require('../models/post')
const studentModel = require('../models/student')
const clubModel = require('../models/club')
const jwt = require("jsonwebtoken")
const { post } = require('../routes/posts')

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
        likes: 0
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


exports.getPosts = async function (req, res, next) {
    console.log("hello");

    // for now, accept tags and clubs to filter by
    const { tags, clubs } = req.body //change to req.query

    // pull userEmail/clubEmail from jwt to get tags + clubs for that user/club alone
    // pass those to the query below
    try {
        const posts = await postModel.find({
            $or: [{
                tags: {
                    $in: tags
                }
            }, {
                authorEmail: {
                    $in: clubs
                }
            }]
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    res.status(200).json({
        message: "Posts successfully queried.",
        posts
    })
}

exports.addPostLike = async function (req, res) {
    const { authorEmail, post_id } = req.body
    try{
        post = await postModel.findByIdAndUpdate(
            post_id,
            {$inc: {'likes': 1} }
        )
        likes = post.get('likes');
        console.log("likes", likes)
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
    try {
        await post.save()
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
    res.status(201).json({
        message: "incremented post like",
        post
    })
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

    res.status(200).json({
        message: "Get post likes",
        likes
    })
}
exports.addPostComment = async function (req, res) {
    const { authorEmail, post_id, comment } = req.body 
    try{
        let post = await postModel.findById(post_id)
        await post.get('comments').push({
            authorEmail: authorEmail,
            body: comment,
            date: new Date(),
        })
        await post.save()
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    res.status(201).json({
        message: "Add Comments",
    })
}

exports.getPostComments = async function (req, res, next) {
    const {post_id} = req.body
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


exports.savePost = async function (req, res) {
    // add postid to saved posts field for student + club
    const {email, accountType, post_id} = req.body

    if(accountType = "student") {
        try {
            let user = await studentModel.findOne({ email })
            user.savedPosts.push(post_id)
            await user.save()
        } catch (err) {
            return res.status(400).json({
                message: err.message
            })
        }
        res.status(201).json({
            message: "student created saved post",
        })
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
    if(accountType == "student") {
        try {
            let user = await studentModel.findOne({email})
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
            let user = await clubModel.findOne({email})
            posts = user.get('savedPosts');
            console.log('savedPosts', posts)
        } catch (err) {
            return res.status(400).json({
                message: err.message
            })
        }
        res.status(200).json({
            message: "Club Saved Posts successfully queried.",
            posts
        })    
    }
}
