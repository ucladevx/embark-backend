const express = require("express");
const router = express.Router();

const { returnClubs } = require("../helpers/getClubs");
const authorize = require("../helpers/authMiddleware");

router.get("/", authorize, returnClubs);

module.exports = router;
