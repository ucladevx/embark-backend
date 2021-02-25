const express = require("express");
const router = express.Router();

const { editProfile, profile, image, followClub, getFollowedClubs, discover } = require("../helpers/club")
const authorize = require("../helpers/authMiddleware");

router.post("/profile", authorize, editProfile);
router.get("/profile", authorize, profile);

router.post("/profile/image", authorize, image)

//follow clubs
router.post("/following", authorize, followClub)
router.get("/following", authorize, getFollowedClubs)

router.get("/discover", authorize, discover);

module.exports = router;
