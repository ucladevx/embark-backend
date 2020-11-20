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
    }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
