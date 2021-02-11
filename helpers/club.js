const clubModel = require('../models/club')
const jwt = require("jsonwebtoken");
const imageFunction = require("../helpers/image");
const authorize = require("../helpers/authMiddleware");

const findAndUpdate = async (decodedEmail, updatedFields) => {
  const club = await clubModel.findOne({ email: decodedEmail });
  const result = await clubModel.updateOne({ _id: club._id }, updatedFields);
  returnedClub = await clubModel.findOne({ email: decodedEmail }); //to get the updated student
  return returnedClub;
}

exports.editProfile = async function (req, res, next) {
  const { name, tags, description, profilePicURL, coverPicURL, website } = req.body;
  editableFields = { name, tags, description, profilePicURL, coverPicURL, website };
  // const decodedToken=await authorize(req,res,next);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get('secretKey'));
  try {
    const updatedFields = {};
    Object.keys(editableFields).forEach(key => {
      if (req.body[key]) {
        updatedFields[key] = req.body[key];
      }
    });
    const updatedClub = await findAndUpdate(decodedToken.email, updatedFields);
    res.send({ updatedClub });
  }
  catch (err) {
    return res.json({ message: err.message });
  }
}

exports.profile = async function (req, res, next) {
  // const decodedToken = await authorize(req, res, next);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get('secretKey'));
  const club = await clubModel.findOne({ email: decodedToken.email });
  res.send({ club });
}

exports.image = async function (req, res, next) {
  const { pictureType } = req.query;
  const imageURL = await imageFunction(req, res, next);   //gets the aws image URL

  try {
    // const decodedToken = await authorize(req, res, next);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, req.app.get('secretKey'));
    let updatedFields;
    if (pictureType === 'cover') {
      updatedFields = { coverPicURL: imageURL }
    }
    else {
      updatedFields = { profilePicURL: imageURL }
    }
    //finds the person and uploads their picture

    const updatedClub = await findAndUpdate(decodedToken.email, updatedFields);
    res.send({ updatedClub });

  }
  catch (err) {
    return res.json({ "message": "ID not found (it is likely the token is incorrect)" });
  }
}