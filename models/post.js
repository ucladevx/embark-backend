const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
  },
  authorEmail: {
    type: String,
    required: true,
  },
  // comments + likes fields
  likes: {
    type: Number,
  },
  // emails of users who liked the post
  userLikes: {
    type: [String],
  },
  comments: [
    {
      body: String,
      authorEmail: String,
      date: Date,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
