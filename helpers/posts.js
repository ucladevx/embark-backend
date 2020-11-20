const postModel = require('../models/post')

exports.create = async function (req, res, next) {
    const { title, body, timestamp, tags } = req.body 

    // pull email from jwt

    // create unique post id

    // save post to db
    const post = new postModel({
        title,
        body,
        timestamp: new Date(),
        tags
    })

    try {
        await post.save()
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
    
    res.status(501).json({
        message: "Post creation not implemented yet",
        title,
        body,
        timestamp,
        tags
    })
}