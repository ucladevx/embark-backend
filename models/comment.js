const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  postID: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
