const express = require("express");
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const StudentModel = require('../models/student.js');

var jwt=require('jsonwebtoken');

const { signin, signup } = require("../helpers/auth")

// implement the jwt check and modify the router.post like so:
// const { existingJwtCheck } = require("../helpers/authMiddleware") 
// router.post("/signin", existingJwtCheck, signin)
router.post(
    "/signin",
    
    async (req,res,next)=>{
        passport.authenticate(
            "signin",
            async(err,Student)=>{
                try{
                    if(eerr || !Student){
                        const error=new Error('Error');
                        return next(error);
                    }

                req.signin(
                    Student,
                    {session:false},
                    async (error) => {
                        if (error) return next(error);
                        const body={_id:Student._id,name:Student.name,email:Student.email};
                        const token=jwt.sign({Student:body},'TOP_SECRET');
                        return res.json({token});
                    }
                );
            } catch (error) {
                return next(error);
            }
            }
        ) (req,res,next);
    }
);

// probably wanna look into setting up student/signup and club/signup as different endpoints
router.post("/signin", signin)
router.post("/signup", signup)

module.exports = router;