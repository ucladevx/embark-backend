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
  const student = await studentModel.find({ _id: decodedToken.id });
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
  returnedStudent = await studentModel.find({ _id: decodedToken.id });
  res.send({ returnedStudent });
}

exports.profile = async function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = await jwt.verify(token, req.app.get('secretKey'));
  const student = await studentModel.find({ _id: decodedToken.id });
  res.send({ student });
}

const findAndUpdate = async (decodedEmail, updatedFields) => {
  const student = await studentModel.find({ _id: decodedToken.id });
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
  const student = await studentModel.find({ _id: decodedToken.id });
  res.send({ student });
}

exports.image = async function (req, res, next) {
  const { pictureType } = req.query;
  const imageURL = await imageFunction(req, res, next);   //gets the aws image URL
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const decoded = jwt.decode(token);
  try {
    // const decodedToken = await authorize(req, res, next);
    //let id = decoded.payload.id;
    console.log(decoded);
    let updatedFields;
    console.log(pictureType);
    if (pictureType === 'cover') {
      updatedFields = { coverPicURL: imageURL }
    }
    else {
      updatedFields = { profilePicURL: imageURL }
    }
    console.log("it made it here")
    const updatedStudent = await studentModel.findOneAndUpdate({email: decoded.email}, updatedFields);
    //const updatedStudent = await studentModel.findOne({email: decoded.email})
    return res.status(200).json(updatedStudent)
  }
  catch (err) {
    console.log("something")
    return res.status(400).json({ message: err.message });
  }
}

exports.getClubs = async function (req, res) {
  
  // pull email from jwt
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token, { complete: true });
  let id = decoded.payload.id;
  console.log('Request made from:', id)

  // Find which clubs the student follows
  let clubs = []
  try {
    clubs = await studentModel.findOne({ _id: id }, 'clubs');
    console.log('Clubs:', clubs)
  }
  catch (err) {
    return res.status(400).json({
      message: err.message 
    })
  }

  let clubDetails = []

  // Find details of each followed club
  clubs.clubs.forEach(async (club) => {
    const clubQuery = await clubModel.findOne({email: club});
    clubDetails.push({
      website: clubQuery.website,
      description: clubQuery.description,
      profilePicURL: clubQuery.profilePicURL
    })
  })

  return res.status(200).json({
    message: "Query successful",
    clubDetails
  })
}

  /*
  if (clubs) {
    try {
      const clubsQueried = await clubModel.findOne({ email: clubs })
      clubsQueried.forEach(club => {
        clubDetails.push({
          website: club.website,
          description: club.description,
          profilePicURL: club.profilePicURL
        })
      }) 
      return res.status(200).json({
        message: "Clubs queried successfully.",
        clubDetails
      })
    }
    catch (err) {
      return res.status(400).json({
        message: err.message 
      })
    }
  }
  return res.status(200).json({
    message: "No clubs.",
    clubDetails
  })
*/

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

