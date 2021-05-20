const clubModel = require("../models/club");
const studentModel = require("../models/student");
const jwt = require("jsonwebtoken");
const imageFunction = require("../helpers/image");
const { changeField } = require("../helpers/student");
const { decodeToken } = require("../helpers/utils");
const MongoPaging = require("mongo-cursor-pagination");

const findAndUpdate = async (decodedEmail, updatedFields) => {
  const club = await clubModel.findOne({ email: decodedEmail });
  const result = await clubModel.updateOne({ _id: club._id }, updatedFields);
  returnedClub = await clubModel.findOne({ email: decodedEmail }); //to get the updated student
  return returnedClub;
};

exports.editProfile = async function (req, res, next) {
  const {
    name,
    resources,
    description,
    tags,
    profilePicURL,
    coverPicURL,
    website,
  } = req.body;
  editableFields = { name, description, profilePicURL, coverPicURL, website };
  // const decodedToken=await authorize(req,res,next);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get("secretKey"));
  try {
    const updatedFields = {};
    Object.keys(editableFields).forEach((key) => {
      if (req.body[key]) {
        updatedFields[key] = req.body[key];
      }
    });
    //changing tags
    const club = await clubModel.findById({ _id: decodedToken.id });
    var changeTags = club.tags;
    if (tags) {
      changeTags = changeField(tags, club.tags, changeTags);
      updatedFields["tags"] = changeTags;
    }
    const updatedClub = await findAndUpdate(decodedToken.email, updatedFields);
    return res.send({ updatedClub });
  } catch (err) {
    return res.json({ message: err.message });
  }
};

exports.profile = async function (req, res, next) {
  // const decodedToken = await authorize(req, res, next);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get("secretKey"));
  const club = await clubModel.findOne(
    { _id: decodedToken.id },
    { password: 0 }
  );
  return res.send({ club });
};

exports.image = async function (req, res, next) {
  const { pictureType } = req.query;
  const imageURL = await imageFunction(req, res, next); //gets the aws image URL

  try {
    // const decodedToken = await authorize(req, res, next);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, req.app.get("secretKey"));
    let updatedFields;
    if (pictureType === "cover") {
      updatedFields = { coverPicURL: imageURL };
    } else {
      updatedFields = { profilePicURL: imageURL };
    }
    //finds the person and uploads their picture

    const updatedClub = await findAndUpdate(decodedToken.email, updatedFields);
    return res.send({ updatedClub });
  } catch (err) {
    return res.json({
      message: "ID not found (it is likely the token is incorrect)",
    });
  }
};

// POST
// request body: userEmail, clubEmail (to follow)
exports.followClub = async function (req, res, next) {
  const { userEmail, clubEmail } = req.body;
  resMessage = "";
  try {
    let user = await clubModel.findOne({
      email: userEmail,
    });

    let followedClubs = await user.get("followedClubs");
    console.log("followedClubs", followedClubs);

    if (followedClubs.includes(clubEmail)) {
      resMessage = "this user already follows this club";
    } else {
      await followedClubs.push(clubEmail);
      await user.save();
      resMessage = "club successfully follwed club";
    }
    return res.status(201).json({
      message: resMessage,
      followedClubs,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

// GET
// request body: userEmail
// returns: list of followed clubs
exports.getFollowedClubs = async function (req, res) {
  const { userEmail } = req.body;
  try {
    const user = await clubModel.findOne({
      email: userEmail,
    });
    console.log(user);
    let followedClubs = await user.get("followedClubs");
    console.log("followedClubs", followedClubs);

    return res.status(200).json({
      message: "Get club's followed clubs",
      followedClubs,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.discover = async function (req, res) {
  let email = decodeToken(req);
  let user;
  try {
    user = await studentModel.findOne({ email: email });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
  const { limit, next, previous } = req.query;

  let tags = user.toObject().tags;
  let clubs = user.toObject().clubs;
  try {
    const result = await MongoPaging.find(clubModel.collection, {
      query: {
        $and: [
          {
            tags: {
              $in: tags,
            },
          },
          {
            name: { $nin: clubs },
          },
        ],
      },
      paginatedField: "_id",
      limit: parseInt(limit),
      next: next,
      previous: previous,
    });
    return res.status(200).json({
      result: result,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.getResources = async function (req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, req.app.get("secretKey"));
  const getClub = await clubModel.findOne({ _id: decodedToken.id });
  console.log(getClub);
  return res.status(200).json({
    success: true,
    resources: getClub["resources"],
    embededlinks: getClub["embededlinks"],
  });
};
