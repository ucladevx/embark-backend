const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const { createPosts, getPosts, savePost, getSavedPosts } = require("../helpers/posts")
// router.post("/create", jwtCheck, create)
=======
const { createPosts, getPosts, savePost, getSavedPosts,  
    addPostLike, getPostLikes, addPostComment, getPostComments } = require("../helpers/posts")
>>>>>>> d540e6de8874e3f0093ac013744f3d063056e14c

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