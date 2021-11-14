const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postID: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorName: {
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
  replies: {
    type: [String],
  },
});

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;
