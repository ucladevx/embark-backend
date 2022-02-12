const express = require("express");
const router = express.Router();

const { completeSearch, postSearch } = require("../helpers/search");
const authorize = require("../helpers/authMiddleware");

router.post("/", authorize, completeSearch);
router.post("/posts", authorize, postSearch);

module.exports = router;
