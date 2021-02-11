const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    clubs: {
        type: [String]
    },
    tags: {
        type: [String]
    },
    website: {
        type: String
    },
    description: {
        type: String
    },
    profilePicURL: {
        type: String
    },
    coverPicURL: {
        type: String
    },
    savedPosts: { //again, not sure if necessary. will remove after testing.
        type: [String]
    },
    events: {
        type: [String]
    },
    eventsHost: {
        type: [String]
    }
})

const Club = mongoose.model("Club", clubSchema);
module.exports = Club;