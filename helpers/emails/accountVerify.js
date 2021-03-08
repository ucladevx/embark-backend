const studentModel = require("../../models/student");
const clubModel = require("../../models/club");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const VerifyAccountTemplate = require("../../mjml/accountVerify");

exports.sendVerify = async function (user, type) {
  const name = user.firstName;
  const email = user.email;

  const token = jwt.sign(
    { email: email, type: type },
    req.app.get("secretKey"),
    {
      expiresIn: 8640000,
    }
  );
  try {
    const msg = {
      to: email,
      from: "theembarkteam@gmail.com",
      subject: "Embark: Verify Account",
      substitutionWrappers: ["{{", "}}"],
      substitutions: {
        verifyLink: `http://localhost:9000/auth/verifyAccount/${token}`,
        name: name,
      },
      html: VerifyAccountTemplate.html,
    };
    await sendMail(msg);
    return res.status(200).json({
      message: "Verification email sent!",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.verifyAccount = async function (req, res, next) {
  const token = req.params.token;
  if (token !== undefined) {
    try {
      const decodedToken = jwt.verify(token, req.app.get("secretKey"), {
        complete: true,
      });
      const email = decodedToken.payload.email;
      const type = decodedToken.payload.type;
      if (type === "student") {
        await studentModel.findOneAndUpdate({ email: email }, { active: true });
      } else if (type === "club") {
        await clubModel.findOneAndUpdate({ email: email }, { active: true });
      } else {
        return res.status(401).json({
          message: "invalid user type",
        });
      }
      return res.status(200).json({
        message: "Account sucessfully verified",
      });
    } catch (err) {
      //maybe redirect to login page
      return res.status(401).json({
        message: error.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "No token present",
    });
  }
};
