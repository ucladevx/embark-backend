const studentModel = require("../models/student");
const clubModel = require("../models/club");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendVerify } = require("../helpers/emails/accountVerify");

//endpoints without password
exports.newsignin = async function (req, res, next) {
  const { email } = req.body;

  try {
    let userInfo;
    let name;
    if (req.body.userType === "club") {
      userInfo = await clubModel.findOne({
        email: email,
      });
      name = userInfo.name;
    } else {
      userInfo = await studentModel.findOne({
        email: email,
      });
      name = userInfo.firstName;
    }

    const activeStatus = userInfo.active;
    if (activeStatus === false) {
      return res.status(401).json({
        message: "Account email not verified",
      });
    }

    //account is a success!
    const token = jwt.sign(
      { id: userInfo._id, name: name, email: email },
      req.app.get("secretKey"),
      { expiresIn: 8640000 }
    );
    return res.send({ token: token });
  } catch (err) {
    return res.status(401).json({
      message: "Email not found",
    });
  }
};

//TODO: create jwt, hash password, change fields in studentModel
exports.newsignup = async function (req, res, next) {
  const { firstName, lastName, email } = req.body;

  let token;
  let emailVerificationMessage = "No message.";
  if (req.body.userType == "student") {
    const student = new studentModel({
      firstName,
      lastName,
      email,
      password: "",
      major: "",
      year: 0000,
      posts: [],
      tags: [],
      savedPosts: [],
      clubs: [],
      bio: "",
      profilePicURL: "",
      coverPicURL: "",
      linkedIn: "",
      active: true,
    });
    token = jwt.sign(
      { id: student._id, name: firstName, email: email },
      req.app.get("secretKey"),
      { expiresIn: 8640000 }
    );

    //check if in clubModel
    const userInClub = await clubModel.exists({ email: email });
    if (userInClub) {
      return res.status(400).json({
        message:
          "A club account with that email already exists. Please use another email.",
      });
    }

    try {
      await student.save();
      emailVerificationMessage = await sendVerify(req, res, student, "student");
    } catch (e) {
      if (e.message.includes("duplicate") && e.message.includes("name")) {
        return res.status(400).json({
          message: "Account with name already exists. Please use another name.",
        });
      } else if (e.message.includes("duplicate")) {
        return res.status(400).json({
          message:
            "Account with email already exists. Please use another email.",
        });
      }

      return res.status(400).json({ message: e.message });
    }
  }
  if (req.body.userType == "club") {
    console.log("1");
    const club = new clubModel({
      name: firstName,
      email,
      password: " ",
      tags: [],
      website: "",
      description: "",
      profilePicURL: "",
      coverPicURL: "",
      savedPosts: [],
      resources: [],
      embededlinks: [],
      active: true,
    });
    console.log("2");
    token = jwt.sign(
      { id: club._id, name: firstName, email: email },
      req.app.get("secretKey"),
      { expiresIn: 8640000 }
    );
    console.log("3");
    //check if email in studentModel
    const userInStudent = await studentModel.exists({ email: email });
    if (userInStudent) {
      return res.status(400).json({
        message:
          "A student account with that email already exists. Please use another email.",
      });
    }
    console.log("4");
    try {
      await club.save();
      console.log("5");
      emailVerificationMessage = await sendVerify(req, res, club, "club");
    } catch (e) {
      if (e.message.includes("duplicate")) {
        return res.status(400).json({
          message:
            "Account with email already exists. Please use another email.",
        });
      }
      return res.status(400).json({ message: e.message });
    }
  }
  return res.status(200).json({
    auth: true,
    token,
    emailVerificationMessage,
  });
};
