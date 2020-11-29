const express = require("express");
const router = express.Router();
const StudentModel = require('../models/student.js');
const jwt = require('jsonwebtoken');

const { signin, signup } = require("../helpers/auth")

// implement the jwt check and modify the router.post like so:
// const authorize = require("../helpers/authMiddleware");

router.post('/signin', signin);
router.post("/signup", signup)

module.exports = router;