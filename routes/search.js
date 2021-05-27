const express = require("express");
const router = express.Router();

const { completeSearch } = require("../helpers/search");
const { returnUserPosts } = require("../helpers/getUserPosts");

const authorize = require("../helpers/authMiddleware");

router.get("/", authorize, completeSearch);
router.get("/userPosts", authorize, returnUserPosts);
module.exports = router;
