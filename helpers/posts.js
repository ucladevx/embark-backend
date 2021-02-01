const postModel = require('../models/post')
const studentModel = require('../models/student')
const jwt = require("jsonwebtoken")

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
        authorEmail: email
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
    // for now, accept tags and clubs to filter by
    const { tags, clubs } = req.body //change to req.query

    // pull userEmail/clubEmail from jwt to get tags + clubs for that user/club alone
    // pass those to the query below

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

    res.status(200).json({
        message: "Posts successfully queried.",
        posts
    })
}

exports.savePost = async function (req, res, next) {

    // add postid to saved posts field for student + club

    res.status(503).json({
        message: "Not implemented yet",
    })
}

exports.getSavedPosts = async function (req, res, next) {

    // return array of posts

    res.status(503).json({
        message: "Not implemented yet",
    })
}