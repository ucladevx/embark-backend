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

exports.changeField = function (inputArray, studentField, changeArray) {
  for (item of inputArray) {
    if (item.substring(0, 2) == "rm" && studentField.includes(item.substring(2, item.length))) {
      changeArray.splice(changeArray.indexOf(item.substring(2, item.length)), 1); //delete the tag

    }
    else {
      if (item.substring(0, 2) != "rm") {
        if (!studentField.includes(item)) {
          changeArray.push(item);
        }

      }
    }
  }
  return changeArray;
}
const { changeField } = require('../helpers/student');

exports.profile = async function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = await jwt.verify(token, req.app.get('secretKey'));
  const student = await studentModel.findOne({ email: decodedToken.email });
  res.send({ student });
}

const findAndUpdate = async (decodedEmail, updatedFields) => {
  const student = await studentModel.findOne({ email: decodedEmail });
  const result = await studentModel.updateOne({ _id: student._id }, updatedFields);
  returnedStudent = await studentModel.findOne({ email: decodedEmail }); //to get the updated student
  return returnedStudent;
}


exports.editProfile = async function (req, res, next) {
  const { name, major, year, tags, clubs, bio, linkedIn } = req.body;
  editableFields = { name, major, year, bio, linkedIn };
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
    //UPDATES THE TAGS AND CLUBS (deletes tags that have rm before it)
    const student = await studentModel.findOne({ email: decodedToken.email });
    var changeTags = student.tags;
    var changeClubs = student.clubs;

    if (tags) {
      changeTags = changeField(tags, student.tags, changeTags);
      updatedFields["tags"] = changeTags;
    }
    if (clubs) {
      changeClubs = changeField(clubs, student.clubs, changeClubs);
      updatedFields["clubs"] = changeClubs;
    }
    // updates the clubs


    const updatedStudent = await findAndUpdate(decodedToken.email, updatedFields);
    //update tags and clubs

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
  let student = await studentModel.findOne({ email: decodedToken.email }, { password: 0 });
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
  const { userEmail, clubEmail } = req.body;
  resMessage = ""
  try {
    let user = await studentModel.findOne({
      email: userEmail
    })

    let followedClubs = await user.get('followedClubs')
    console.log('followedClubs', followedClubs)

    if (followedClubs.includes(clubEmail)) {
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
  const { userEmail } = req.body;
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


exports.search = async function (req, res) {
  try{
    const {searchString} = req.body;
    let searchResult = await studentModel.find({$text: {$search: searchString}})
    // returns an array of objects that match
    // todo: return the names of each search
    console.log(searchResult)
    console.log(searchResult[0].name)
    res.status(200).json({
      result: searchResult[0].name
    })
  }catch(e) {
    res.status(400).json({
      message: e.message
    })
  }
}