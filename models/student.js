const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *  schemas:
 *    Student:
 *      type: object
 *      required:
 *        - firstName
 *        - lastName
 *        - email
 *      properties:
 *        firstName:
 *          type: String
 *        lastName:
 *          type: String
 *        email:
 *          type: String
 *        password:
 *          type: String
 *        major:
 *          type: String
 *        year:
 *          type: String
 *        posts:
 *          type: array
 *          items:
 *            type: String
 *        tags:
 *          type: array
 *          items:
 *            type: String
 *        savedPosts:
 *          type: array
 *          items:
 *            type: String
 *        likedPosts:
 *          type: array
 *          items:
 *            type: String
 *        commentedPosts:
 *          type: array
 *          items:
 *            type: String
 *        clubs:
 *          type: array
 *          items:
 *            type: String
 *        bio:
 *          type: String
 *        profilePicURL:
 *          type: String
 *        coverPicURL:
 *          type: String
 *        linkedIn:
 *          type: String
 *        events:
 *          type: array
 *          items:
 *            type: String
 *        followedClubs:
 *          type: array
 *          items:
 *            type: String
 *        active:
 *          type: boolean
 *
 */
const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  clubs: { // ? what is this for?
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
  active: {
    type: Boolean,
    default: "false",
  },
});
studentSchema.index({ firstName: 1,lastName: 1 });


const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
