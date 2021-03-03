const express = require("express");
const router = express.Router();

const { createPosts, getPosts, savePost, getSavedPosts,
  addPostLike, getPostLikes, addPostComment, getPostComments } = require("../helpers/posts")

const { getPostsPage } = require("../helpers/postsPagination")
const authorize = require("../helpers/authMiddleware");

router.post("/", authorize, createPosts)
router.get("/", authorize, getPosts)

router.post("/saved", authorize, savePost)
router.get("/saved", authorize, getSavedPosts)

// likes
router.post("/likes", authorize, addPostLike)
router.get("/likes", authorize, getPostLikes)

// comments
router.post("/comments", authorize, addPostComment)
router.get("/comments", authorize, getPostComments)

router.get("/postsPage", authorize, getPostsPage)

module.exports = router;