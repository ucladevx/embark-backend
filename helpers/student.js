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
  const student = await studentModel.findOne({ _id: decodedToken.id });
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
  returnedStudent = await studentModel.findOne({ _id: decodedToken.id });
  res.send({ returnedStudent });
}

exports.profile = async function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = await jwt.verify(token, req.app.get('secretKey'));
  const student = await studentModel.findOne({ _id: decodedToken.id });
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
    const updatedStudent = await findAndUpdate(decodedToken.id, updatedFields);
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
  const student = await studentModel.findOne({ _id: decodedToken.id });
  res.send({ student });
}

exports.image = async function (req, res, next) {
  const { pictureType } = req.query;
  const imageURL = await imageFunction(req, res, next);   //gets the aws image URL
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);
    console.log(decoded);
    let updatedFields;
    console.log(pictureType);
    if (pictureType === 'cover') {
      updatedFields = { coverPicURL: imageURL }
    }
    else {
      updatedFields = { profilePicURL: imageURL }
    }
    const updatedStudent = await studentModel.findOneAndUpdate({ _id: decoded.id }, updatedFields);
    return res.status(200).json(updatedStudent)
  }
  catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.getClubs = async function (req, res) {

  // pull id from jwt
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token, { complete: true });
  let id = decoded.payload.id;
  console.log('Request made from:', id)

  // Find which clubs the student follows
  let clubs
  try {
    clubs = await studentModel.findOne({ _id: id }, 'clubs');
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }

  let clubDetails = []

  for (const club of clubs.clubs) {
    const clubQuery = await clubModel.findOne({ email: club })
    if (clubQuery) {
      clubDetails.push({
        name: clubQuery.name,
        website: clubQuery.website,
        description: clubQuery.description,
        profilePicURL: clubQuery.profilePicURL
      })
    } else {
      clubDetails.push("Club not found in club database.") // possibly throw Error or return early with status 500
    }
  }

  return res.status(200).json(clubDetails)
}

exports.getIndustries = async function (req, res) {
  
  // pull email from jwt
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token, { complete: true });
  let id = decoded.payload.id;
  console.log('Request made from:', id)

  // Find which industries the student follows
  let industries = []
  try {
    industries = await studentModel.findOne({ _id: id }, 'tags'); // TODO: make this industries
    console.log('Industries:', industries)                             // "tags" is industries
    return res.status(200).json({
      message: "Query successful",
      industries
    })
  }
  catch (err) {
    return res.status(400).json({
      message: err.message 
    })
  }
}


  
