const express = require("express");
const router = express.Router();
const resourceFunction = require("../helpers/resources-busboy");

const {
  editProfile,
  profile,
  image,
  followClub,
  getFollowedClubs,
  discover,
  getResources,
  getClubById
} = require("../helpers/club");
const authorize = require("../helpers/authMiddleware");

router.post("/resources", authorize, resourceFunction);
router.get("/resources", authorize, getResources); //add some resouces array to club model
// router.get("/profile/image")

router.post("/profile", authorize, editProfile);
router.get("/profile", authorize, profile);

router.post("/profile/image", authorize, image);

//follow clubs
router.post("/following", authorize, followClub);
router.get("/following", authorize, getFollowedClubs);

router.get("/discover", authorize, discover);

router.get("/profileById", authorize, getClubById);

module.exports = router;
