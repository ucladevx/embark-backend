const express = require("express");
const router = express.Router();

const { create, getPosts } = require("../helpers/posts")

// router.post("/create", jwtCheck, create)

router.post("/create", create)
router.get("/", getPosts)

module.exports = router;