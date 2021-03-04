const express = require("express");
const router = express.Router();


const { editProfile, profile, image, getClubs, getIndustries } = require("../helpers/student")
const authorize = require("../helpers/authMiddleware");

router.post("/profile", authorize, editProfile)
router.get("/profile", authorize, profile)

router.post("/profile/image", authorize, image)
// router.get("/profile/image")

router.get("/getClubs", authorize, getClubs)

router.get("/getIndustries", authorize, getIndustries)

module.exports = router;
