const express = require("express");
const router = express.Router();

const { completeSearch } = require("../helpers/search");
const authorize = require("../helpers/authMiddleware");

router.post("/", authorize, completeSearch);

module.exports = router;
