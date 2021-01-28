const express = require("express");
const router = express.Router();

const { createPosts, getPosts, savePost, getSavedPosts } = require("../helpers/posts")

const authorize = require("../helpers/authMiddleware");

router.post("/", authorize, createPosts)
router.get("/", authorize, getPosts)
router.post("/saved", authorize, savePost)
router.get("/saved", authorize, getSavedPosts)

router.post("/posts/like", authorize, addPostLike)
router.get("/posts/like", authorize, getPostLikes)

router.post("/posts/comments", authorize, addPostComment)
router.get("/posts/comments", authorize, getPostComments)

module.exports = router;