const express = require("express");
const router = express.Router();

const {completeSearch} = require("../helpers/search")
const authorize = require("../helpers/authMiddleware");

router.get("/", authorize, completeSearch);

module.exports = router;