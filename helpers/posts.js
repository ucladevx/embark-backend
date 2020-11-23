const postModel = require('../models/post')

exports.create = async function (req, res, next) {
    const { title, body, timestamp, tags, email } = req.body 

    // pull email from jwt. rn only accepting email for testing purposes

    // create unique post id

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
    
    // also return email of author here.
    res.status(201).json({
        message: "Post successfully created.",
        title,
        body,
        timestamp,
        tags,
        email
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