const express = require("express");
const router = express.Router();

const {
  createPosts,
  getPosts,
  savePost,
  unsavePost,
  getSavedPosts,
  addPostLike,
  getPostLikes,
  addPostComment,
  getPostComments,
  getPostsbyUser,
} = require("../helpers/posts");

const { getPostsPage } = require("../helpers/postsPagination");
const authorize = require("../helpers/authMiddleware");

router.post("/", authorize, createPosts);
router.get("/", authorize, getPosts);

router.post("/saved", authorize, savePost);
router.post("/unsaved", authorize, unsavePost);
router.get("/saved", authorize, getSavedPosts);

// likes
router.post("/likes", authorize, addPostLike);
router.get("/likes", authorize, getPostLikes);

// comments
router.post("/comments", authorize, addPostComment);
router.get("/comments", authorize, getPostComments);

//router.get("/postsPage", authorize, getPostsPage)

// posts authored by user
router.get("/me", authorize, getPostsbyUser);

module.exports = router;
