const studentModel = require("../models/student");
const clubModel = require("../models/club");

const jwt = require("jsonwebtoken");
const ObjectID = require("mongodb").ObjectID;

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();

const imageFunction = require("../helpers/image");
const authorize = require("../helpers/authMiddleware");

const findAndUpdate = async (decodedId, updatedFields) => {
  const student = await studentModel.findOne({ _id: decodedId });
  const result = await studentModel.updateOne(
    { _id: student._id },
    updatedFields
  );
  returnedStudent = await studentModel.findOne({ _id: decodedId }); //to get the updated student
  return returnedStudent;
};

exports.changeField = function (inputArray, studentField, changeArray) {
  for (item of inputArray) {
    if (
      item.substring(0, 2) == "rm" &&
      studentField.includes(item.substring(2, item.length))
    ) {
      changeArray.splice(
        changeArray.indexOf(item.substring(2, item.length)),
        1
      ); //delete the tag
    } else {
      if (item.substring(0, 2) != "rm") {
        if (!studentField.includes(item)) {
          changeArray.push(item);
        }
      }
    }
  }
  return changeArray;
};
const { changeField } = require("../helpers/student");

exports.editProfile = async function (req, res, next) {
  const { name, major, year, tags, clubs, bio, linkedIn } = req.body;
  editableFields = { name, major, year, tags, bio, linkedIn };

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get("secretKey"));
  try {
    const updatedFields = {};
    Object.keys(editableFields).forEach((key) => {
      if (req.body[key]) {
        updatedFields[key] = req.body[key];
      }
    });
    //UPDATES THE TAGS AND CLUBS (deletes tags that have rm before it)
    const student = await studentModel.findOne({ _id: decodedToken.id });
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

    const updatedStudent = await findAndUpdate(
      decodedToken.id,
      updatedFields
    );
    //update tags and clubs

    return res.send({ updatedStudent });
  } catch (err) {
    return res.json({ message: err.message });
  }
};

exports.profile = async function (req, res, next) {
  // const decodedToken = await authorize(req, res, next);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get('secretKey'));
  const student = await studentModel.findOne({ _id: decodedToken.id });
  res.send({ student });
};

exports.image = async function (req, res, next) {
  const { pictureType } = req.query;
  const imageURL = await imageFunction(req, res, next); //gets the aws image URL
  try {
    // const decodedToken = await authorize(req, res, next);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, req.app.get('secretKey'));
    console.log(decodedToken)
    let updatedFields;
    console.log("picture", pictureType);
    if (pictureType === 'cover') {
      updatedFields = { coverPicURL: imageURL }
    }
    else {
      updatedFields = { profilePicURL: imageURL }
    }
    const updatedStudent = await studentModel.findOneAndUpdate({ _id: decodedToken.id }, updatedFields);
    return res.status(200).json({ updatedStudent });
  }
  catch (err) {
    return res.json({ message: err.message });
  }
};

// POST
// request body: userEmail, clubEmail (to follow)
//
// ! FIX. accept only clubId; no more is needed.
// ! push clubId into user, not clubEmail
exports.followClub = async function (req, res, next) {
  const { clubId } = req.body;
  resMessage = "";

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get('secretKey'));
  console.log(decodedToken)

  try {
    let user = await studentModel.findOne({
      _id: decodedToken.id,
    });

    let followedClubs = await user.get("followedClubs");
    console.log("followedClubs", followedClubs);

    if (followedClubs.includes(clubId)) {
      resMessage = "this user already follows this club";
    } else {
      await followedClubs.push(clubId);
      await user.save();
      resMessage = "club successfully followed club";
    }

    res.status(201).json({
      message: resMessage,
      followedClubs,
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

// ! FIX. Modify this function to work with the function above
exports.getClubs = async function (req, res) {

  // pull id from jwt
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token, { complete: true });
  let id = decoded.payload.id;
  console.log('Request made from:', id)

  // Find which clubs the student follows
  let clubs
  try {
    clubs = await studentModel.findOne({ _id: id }, 'followedClubs');
    console.log(clubs)
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }

  let clubDetails = []

  for (const club of clubs.followedClubs) {
    const clubQuery = await clubModel.findOne({ _id: club })
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

const getStudentById = async (req, res) => {
  // Get Id from the request
  const { studentId } = req.body;
  console.log('Id passed in:', studentId);
  
  try {
    const student = await studentModel.findById({ _id: studentId });
    return res.status(200).json({
      message: "Query successful",
      student
    }) 
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
};