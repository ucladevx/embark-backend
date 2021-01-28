const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    tags: {
        type: [String]
    },
    authorEmail: {
        type: String,
        required: true
    },      
    // comments + likes fields
    likes : {
        type : Integer,  
        required: true
    },
    comments : {
        type : [
            {
                body: String,
                user: String,
                date: Date()
            }
        ],
        required: true
    }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
