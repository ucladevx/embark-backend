const express = require("express");
const router = express.Router();
const StudentModel = require('../models/student.js');
const jwt = require('jsonwebtoken');

const { signin, signup } = require("../helpers/auth");
const {editProfile,profile}=require("../helpers/student");
const {editProfileClub,profileClub}=require("../helpers/club");
const authorize = require("../helpers/authMiddleware");

router.post('/signin', signin);
router.post("/signup", signup);



module.exports = router;