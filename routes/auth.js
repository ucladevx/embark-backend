const express = require("express");
const router = express.Router();
const StudentModel = require('../models/student.js');
const jwt = require('jsonwebtoken');

const { signin, signup } = require("../helpers/auth");
const {editProfile,profile}=require("../helpers/student");
const {editProfileClub,profileClub}=require("../helpers/club");


// implement the jwt check and modify the router.post like so:
const authorize = require("../helpers/authMiddleware");

router.post('/signin', signin);
router.post("/signup", signup);

router.get('/student/profile',authorize,profile);
router.post('/student/profile',authorize,editProfile);

router.get('club/profile',authorize,profileClub);
router.post('/club/profile',authorize,editProfileClub);


module.exports = router;