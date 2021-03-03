const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  major: {
    type: String,
  },
  year: {
    type: Number,
  },
  posts: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  savedPosts: {
    type: [String],
  },
  likedPosts: {
    type: [String],
  },
  commentedPosts: {
    type: [String],
  },
  clubs: {
    type: [String],
  },
  bio: {
    type: String,
  },
  profilePicURL: {
    type: String,
  },
  coverPicURL: {
    type: String,
  },
  linkedIn: {
    type: String,
  },
  events: {
    type: [String],
  },
  followedClubs: {
    type: [String],
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
