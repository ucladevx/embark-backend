const express = require("express");
const router = express.Router();

const { editProfile, profile, image, followClub, getFollowedClubs, discover } = require("../helpers/club")
const authorize = require("../helpers/authMiddleware");

router.post("/profile", editProfile)
router.get("/profile", profile)

router.post("/profile/image", image)

//follow clubs
router.post("/following", authorize, followClub)
router.get("/following", authorize, getFollowedClubs)

router.get("/discover", authorize, discover);
module.exports = router;