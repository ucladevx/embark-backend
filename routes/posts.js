const express = require("express");
const router = express.Router();

const {
  createPosts,
  getPosts,
  savePost,
  getSavedPosts,
  addPostLike,
  getPostLikes,
  addPostComment,
  getPostComments,
  getPostsbyUser,
  removePostLike,
  removePostComment,
} = require("../helpers/posts");

const { getPostsPage } = require("../helpers/postsPagination");
const authorize = require("../helpers/authMiddleware");

router.post("/", authorize, createPosts);
router.get("/", authorize, getPosts);

router.post("/saved", authorize, savePost);
router.get("/saved", authorize, getSavedPosts);

// likes
router.post("/likes", authorize, addPostLike);
router.post("/likes/remove", authorize, removePostLike);
router.get("/likes", authorize, getPostLikes);

// comments
router.post("/comments", authorize, addPostComment);
router.post("/comments/remove", authorize, removePostComment);
router.get("/comments", authorize, getPostComments);

//router.get("/postsPage", authorize, getPostsPage)

// posts authored by user
router.get("/me", authorize, getPostsbyUser);

module.exports = router;
