const express = require("express");
const router = express.Router();

const { createPosts, getPosts, savePost, getSavedPosts } = require("../helpers/posts")

const authorize = require("../helpers/authMiddleware");

router.post("/", authorize, createPosts)
router.get("/", authorize, getPosts)
router.post("/saved", authorize, savePost)
router.get("/saved", authorize, getSavedPosts)

module.exports = router;