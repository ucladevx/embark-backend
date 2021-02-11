const express = require("express");
const router = express.Router();

const { signin, signup } = require("../helpers/auth");
// const authorize = require("../helpers/authMiddleware");

router.post('/signin', signin);
router.post("/signup", signup);

module.exports = router;