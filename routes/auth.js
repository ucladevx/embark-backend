const express = require("express");
const router = express.Router();
const passport = require('passport');

const { signin, signup, oauthSuccess } = require("../helpers/auth");
const authorize = require("../helpers/authMiddleware");

router.post('/signin', signin);
router.post('/signin/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
}));
router.get('/google/redirect', passport.authenticate('google', { session: false, failureRedirect: '/' }), oauthSuccess);
router.post("/signup", signup);

module.exports = router;