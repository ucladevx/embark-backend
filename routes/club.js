const express = require("express");
const router = express.Router();
const { editProfile, profile, image, followClub, getFollowedClubs } = require("../helpers/club")

router.post("/profile", editProfile)
router.get("/profile", profile)

router.post("/profile/image", image)

//follow clubs
router.post("/following", authorize, followClub)
router.get("/following", authorize, getFollowedClubs)

module.exports = router;