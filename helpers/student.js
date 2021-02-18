const studentModel = require('../models/student')
const clubModel = require('../models/club')

const jwt = require("jsonwebtoken");
const ObjectID = require('mongodb').ObjectID;

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();

const imageFunction = require("../helpers/image");
const authorize = require("../helpers/authMiddleware");

exports.editProfile = async function (req, res, next) {
  const { name, major, year, tags, bio, linkedIn } = req.body;
  editableFields = { name, major, year, tags, bio, linkedIn };
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = await jwt.verify(token, req.app.get('secretKey'));
  const student = await studentModel.findOne({ email: decodedToken.email });
  try {
    const updatedFields = {};
    Object.keys(editableFields).forEach(key => {
      if (req.body[key]) {
        updatedFields[key] = req.body[key];
      }
    });
    const result = await studentModel.updateOne({ _id: student._id }, updatedFields);
  }
  catch (err) {
    return res.json({ message: err.message });
  }
  returnedStudent = await studentModel.findOne({ email: decodedToken.email });
  res.send({ returnedStudent });
}

exports.profile = async function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = await jwt.verify(token, req.app.get('secretKey'));
  const student = await studentModel.findOne({ email: decodedToken.email });
  res.send({ student });
}

const findAndUpdate = async (decodedEmail, updatedFields) => {
  const student = await studentModel.findOne({ email: decodedEmail });
  console.log(1)
  console.log(decodedEmail)
  console.log(student)
  const result = await studentModel.updateOne({ _id: student._id }, updatedFields);
  returnedStudent = await studentModel.findOne({ email: decodedEmail }); //to get the updated student
  return returnedStudent;
}


exports.editProfile = async function (req, res, next) {
  const { name, major, year, tags, bio, linkedIn } = req.body;
  editableFields = { name, major, year, tags, bio, linkedIn };
  // const decodedToken = await authorize(req, res, next);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get('secretKey'));
  try {
    const updatedFields = {};
    Object.keys(editableFields).forEach(key => {
      if (req.body[key]) {
        updatedFields[key] = req.body[key];
      }
    });
    const updatedStudent = await findAndUpdate(decodedToken.email, updatedFields);
    return res.send({ updatedStudent });
  }
  catch (err) {
    return res.json({ message: err.message });
  }

}

exports.profile = async function (req, res, next) {
  // const decodedToken = await authorize(req, res, next);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get('secretKey'));
  const student = await studentModel.findOne({ email: decodedToken.email });
  res.send({ student });
}

exports.image = async function (req, res, next) {
  const { pictureType } = req.query;
  const imageURL = await imageFunction(req, res, next);   //gets the aws image URL
  try {
    // const decodedToken = await authorize(req, res, next);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, req.app.get('secretKey'));
    let updatedFields;
    console.log(pictureType);
    if (pictureType === 'cover') {
      updatedFields = { coverPicURL: imageURL }
    }
    else {
      updatedFields = { profilePicURL: imageURL }
    }
    const updatedStudent = await findAndUpdate(decodedToken.email, updatedFields);
    res.send({ updatedStudent });
  }
  catch (err) {
    return res.json({ message: err.message });
  }
}

// POST
// request body: userEmail, clubEmail (to follow)
// 
exports.followClub = async function (req, res, next) {
  const {userEmail, clubEmail} = req.body;
  resMessage = ""
  try {
    let user = await studentModel.findOne({
      email: userEmail
    })
    console.log(userEmail)
    console.log(user)
    
    let followedClubs = await user.get('followedClubs')
    console.log('followedClubs', followedClubs)

    if(followedClubs.includes(clubEmail)){
      resMessage = "this user already follows this club"
    } else {
      await followedClubs.push(clubEmail)
      await user.save()
      resMessage = "club successfully follwed club"
    }

    res.status(201).json({
      message: resMessage,
      followedClubs
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}

// GET
// request body: userEmail
// returns: list of followed clubs
exports.getFollowedClubs = async function (req, res) {
  const {userEmail} = req.body;
  try {
    const user = await studentModel.findOne({
      email: userEmail
    })
    console.log(user)
    let followedClubs = await user.get('followedClubs')
    console.log('followedClubs', followedClubs)

    res.status(200).json({
      message: "Get student's followed clubs",
      followedClubs
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}
