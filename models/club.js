const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
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
    required: true,
  },
  clubs: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  website: {
    type: String,
  },
  description: {
    type: String,
  },
  profilePicURL: {
    type: String,
  },
  coverPicURL: {
    type: String,
  },
  posts: {
    type: [String],
  },
  events: {
    type: [String],
  },
  eventsHost: {
    type: [String],
  },
  savedPosts: {
    //again, not sure if necessary. will remove after testing.
    type: [String],
  },
  followedClubs: {
    type: [String],
  },
  resources: {
    type: [],
  },
  active: {
    type: Boolean,
    default: "false",
  },
});

const Club = mongoose.model("Club", clubSchema);
module.exports = Club;
