const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const studentModel = require("../../models/student");
const clubModel = require("../../models/club");
const PasswordResetTemplate = require("../../mjml/passwordReset");

exports.forgotPass = async function (req, res, next) {
  const email = req.body.email;
  if (email !== undefined) {
    const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regExpEmail.test(email)) {
      return res.status(400).send({ message: "Invalid email" });
    }

    const token = jwt.sign({ email: email }, req.app.get("secretKey"), {
      expiresIn: 8640000,
    });
    try {
      const msg = {
        to: email,
        from: "theembarkteam@gmail.com",
        subject: "Embark: Password Reset",
        substitutionWrappers: ["{{", "}}"],
        substitutions: {
          resetLink: `http://localhost:9000/auth/resetPassword/${token}`,
        },
        html: PasswordResetTemplate.html,
      };
      await sendMail(msg);
      return res.status(200).json({
        message: "Reset email sent!",
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  } else {
    return res.status(400).json({
      message: "Email required!",
    });
  }
};

exports.resetPass = async function (req, res, next) {
  const token = req.params.token;
  if (token !== undefined) {
    try {
      const decodedToken = jwt.verify(token, req.app.get("secretKey"));
      return res.status(200).json({
        token: token,
      });
    } catch (err) {
      //maybe redirect to login page
      return res.status(401).json({
        message: error.message,
      });
    }
  }
};

exports.changePass = async function (req, res, next) {
  const token = req.params.token;

  if (token !== undefined) {
    try {
      const decodedToken = jwt.verify(token, req.app.get("secretKey"));
      const regExpPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
      if (!regExpPassword.test(req.body.password)) {
        return res.status(400).send({
          message:
            "Password must be 8 characters, must have one Uppercase, one Lowercase, and one special character",
        });
      }
      let hashPassword = await bcrypt.hashSync(req.body.password, 10);
      let student = await studentModel.findOneAndUpdate(
        { email: decodedToken.email },
        {
          password: hashPassword,
        }
      );
      return res.status(200).json({
        message: "Password reset successful",
      });
    } catch (err) {
      //maybe redirect to login page
      return res.status(401).json({
        message: error.message,
      });
    }
  }
};

async function sendMail(msg) {
  sgMail
    .send(msg)
    .then(() => {
      //console.log('Email sent')
    })
    .catch((error) => {
      throw error;
    });
}
