const express = require("express");
const router = express.Router();

const { createPosts, getPosts, savePost, getSavedPosts } = require("../helpers/posts")

const { getPostsPage } = require("../helpers/postsPagination")
const authorize = require("../helpers/authMiddleware");

router.post("/", authorize, createPosts)
router.get("/", authorize, getPosts)
router.post("/saved", authorize, savePost)
router.get("/saved", authorize, getSavedPosts)

router.get("/postsPage", authorize, getPostsPage)

module.exports = router;