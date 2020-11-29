const express = require("express");
const router = express.Router();

const { createPosts, getPosts, savePost, getSavedPosts } = require("../helpers/posts")

// router.post("/create", jwtCheck, create)

router.post("/", createPosts)
router.get("/", getPosts)
router.post("/saved", savePost)
router.get("/saved", getSavedPosts)

module.exports = router;