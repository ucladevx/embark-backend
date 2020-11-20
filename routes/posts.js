const express = require("express");
const router = express.Router();

const { create } = require("../helpers/posts")

// router.post("/create", jwtCheck, create)

router.post("/create", create)

module.exports = router;