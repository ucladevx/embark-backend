const express = require("express");
const router = express.Router();

const { signin, signup } = require("../helpers/auth")

// implement the jwt check and modify the router.post like so:
// const { existingJwtCheck } = require("../helpers/authMiddleware") 
// router.post("/signin", existingJwtCheck, signin)

// probably wanna look into setting up student/signup and club/signup as different endpoints
router.post("/signin", signin)
router.post("/signup", signup)

module.exports = router;