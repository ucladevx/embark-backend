const express = require("express");
const router = express.Router();
const StudentModel = require('../models/student.js');

var jwt=require('jsonwebtoken');

const { signin, signup } = require("../helpers/auth")
// implement the jwt check and modify the router.post like so:
// const { existingJwtCheck } = require("../helpers/authMiddleware") 
// router.post("/signin", existingJwtCheck, signin)
const authorize=require("../helpers/authMiddleware");
router.post(
    "/signin",
    authorize, (req, res, next) => {
        StudentModel.findById(req.params.id, (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                    msg: data
                })
            }
        }

    
);

// probably wanna look into setting up student/signup and club/signup as different endpoints
router.post("/signin", signin)
router.post("/signup", signup)

module.exports = router;