const express = require("express");
const router = express.Router();
const passport = require("passport");

const { signin, signup, oauthSuccess } = require("../helpers/auth");
const { newsignin, newsignup } = require("../helpers/auth2"); //for endpoint w no password
const {
  forgotPass,
  resetPass,
  changePass,
} = require("../helpers/emails/password");
const { verifyAccount } = require("../helpers/emails/accountVerify");
const authorize = require("../helpers/authMiddleware");

router.post(
  "/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  })
);

router.get("/linkedin/redirect", function (req, res, next) {
  passport.authenticate("linkedin", function (err, user, info) {
    if (err) {
      return res.redirect("/health"); //TODO: Maybe added an error route
    }
    if (!user) {
      return res.status(401).json({
        message: "Email not found",
      });
    }
    req.logIn(user, { session: false }, function (err) {
      if (err) {
        return res.redirect("/health");
      }
      oauthSuccess(req, res);
    });
  })(req, res, next);
});

router.post(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get("/google/redirect", function (req, res, next) {
  passport.authenticate("google", function (err, user, info) {
    if (err) {
      return res.redirect("/health"); //TODO: Maybe added an error route
    }
    if (!user) {
      return res.status(401).json({
        message: "Email not found",
      });
    }
    req.logIn(user, { session: false }, function (err) {
      if (err) {
        return res.redirect("/health");
      }
      oauthSuccess(req, res);
    });
  })(req, res, next);
});

router.post("/newsignin", newsignin);
router.post("/newsignup", newsignup);

/**
 * @swagger
 * /auth/signin:
 *  post:
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 */
router.post("/signin", signin);

/**
 * @swagger
 * /auth/signup:
 *  post:
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              properties:
 *                firstName:
 *                  type: string
 *                lastName:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 */
router.post("/signup", signup);

router.get("/verifyAccount/:token", verifyAccount);

router.post("/forgotPassword", forgotPass);
router.get("/resetPassword/:token", resetPass);
router.patch("/changePassword/:token", changePass);

module.exports = router;
