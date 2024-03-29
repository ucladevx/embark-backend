const studentModel = require("../models/student");
const clubModel = require("../models/club");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const { sendVerify } = require("../helpers/emails/accountVerify");

passport.use(
  new LinkedInStrategy(
    {
      //options
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      passReqToCallback: true,
      callbackURL: "/auth/linkedin/redirect",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      if (req.body.type === "signin") {
        const email = profile.emails[0].value;
        try {
          let user;
          if (req.body.user === "student")
            user = await findUser(email, "student");
          else if (req.body.user === "club")
            user = await findClub(email, "club");

          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (e) {
          done(e);
        }
      } else if (req.body.type === "signup") {
        const email = profile.emails[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const password = null;

        const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regExpEmail.test(email)) {
          return res.status(400).send({ message: "Invalid email" });
        }

        if (req.body.userType == "student") {
          try {
            student = await createStudent(firstName, lastName, email, password);
            done(null, student);
          } catch (e) {
            done(e);
          }
        } else if (req.body.userType == "club") {
          try {
            club = await createClub(firstName, email, password);
            done(null, club);
          } catch (e) {
            done(e);
          }
        }
      } else {
        done(new Error("request.body.type invalid"));
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      //options
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      passReqToCallback: true,
      callbackURL: "/auth/google/redirect",
    },
    async (req, accessToken, refreshToken, profile, done) => {
      if (req.body.type === "signin") {
        const email = profile.emails[0].value;
        try {
          let user;
          if (req.body.user === "student")
            user = await findUser(email, "student");
          else if (req.body.user === "club")
            user = await findClub(email, "club");

          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (e) {
          done(e);
        }
      } else if (req.body.type === "signup") {
        const email = profile.emails[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const password = null;

        const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regExpEmail.test(email)) {
          return res.status(400).send({ message: "Invalid email" });
        }

        if (req.body.userType == "student") {
          try {
            student = await createStudent(firstName, lastName, email, password);
            done(null, student);
          } catch (e) {
            done(e);
          }
        } else if (req.body.userType == "club") {
          try {
            club = await createClub(firstName, email, password);
            done(null, club);
          } catch (e) {
            done(e);
          }
        }
      } else {
        done(new Error("request.body.type invalid"));
      }
    }
  )
);

findUser = async function (email, type) {
  try {
    let userInfo;
    if (type === "club") {
      userInfo = await clubModel.findOne({
        email: email,
      });
    } else if (type === "student") {
      userInfo = await studentModel.findOne({
        email: email,
      });
    }
    return userInfo;
  } catch (e) {
    throw e;
  }
};

createStudent = async function (firstName, lastName, email, password) {
  const student = new studentModel({
    firstName,
    lastName,
    email,
    password,
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
  });
  try {
    await student.save();
    return student;
  } catch (e) {
    throw e;
  }
};

createClub = async function (name, email, password) {
  const club = new clubModel({
    name,
    email,
    password,
    tags: [],
    website: "",
    description: "",
    profilePicURL: "",
    coverPicURL: "",
    savedPosts: [],
    resources: [],
    embededlinks: [],
  });
  try {
    await club.save();
    return club;
  } catch (e) {
    throw e;
  }
};

exports.oauthSuccess = function (req, res, next) {
  const userInfo = req.user;
  const token = jwt.sign(
    {
      id: userInfo._id,
      name: userInfo.name,
      email: userInfo.email,
      userType: userInfo.userType,
    },
    req.app.get("secretKey"),
    { expiresIn: 8640000 }
  );
  return res.send({ token: token });
};

exports.signin = async function (req, res, next) {
  const { email, password } = req.body;
  if (password == null || password === "") {
    return res.status(401).json({
      message: "Password required",
    });
  }

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

    if (await bcrypt.compare(password, userInfo.password)) {
      const token = jwt.sign(
        {
          id: userInfo._id,
          name: name,
          email: email,
          userType: req.body.userType,
        },
        req.app.get("secretKey"),
        { expiresIn: 8640000 }
      );
      return res.send({ token: token });
    } else {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: "Email not found",
    });
  }
};

//TODO: create jwt, hash password, change fields in studentModel
exports.signup = async function (req, res, next) {
  const { firstName, lastName, email, password } = req.body;

  const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regExpEmail.test(email)) {
    return res.status(400).send({ message: "Invalid email" });
  }

  const regExpPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  if (!regExpPassword.test(password)) {
    return res.status(400).send({
      message:
        "Password must be at least 8 characters, must have one uppercase char, one lowercase char, one number, and one special character",
    });
  }

  let token;
  let emailVerificationMessage = "No message.";
  if (req.body.userType == "student") {
    const student = new studentModel({
      firstName,
      lastName,
      email,
      password,
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
    student.password = await bcrypt.hashSync(password, 10);
    token = jwt.sign(
      {
        id: student._id,
        name: firstName,
        email: email,
        userType: req.body.userType,
      },
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
    const club = new clubModel({
      name: firstName,
      email,
      password,
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
    club.password = await bcrypt.hashSync(password, 10);
    token = jwt.sign(
      {
        id: club._id,
        name: firstName,
        email: email,
        userType: req.body.userType,
      },
      req.app.get("secretKey"),
      { expiresIn: 8640000 }
    );

    //check if email in studentModel
    const userInStudent = await studentModel.exists({ email: email });
    if (userInStudent) {
      return res.status(400).json({
        message:
          "A student account with that email already exists. Please use another email.",
      });
    }

    try {
      await club.save();
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
