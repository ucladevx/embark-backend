const express = require("express");
const router = express.Router();

const {
  editProfile,
  profile,
  image,
  followClub,
  getFollowedClubs,
  search
} = require("../helpers/student");

const authorize = require("../helpers/authMiddleware");

router.post("/profile", authorize, editProfile);
router.get("/profile", authorize, profile);

router.post("/profile/image", authorize, image);

// following clubs
router.post("/following", authorize, followClub);
router.get("/following", authorize, getFollowedClubs);

router.get("/search", authorize, search)

module.exports = router;
