const express = require("express");
const router = express.Router();

const {
  editProfile,
  profile,
  image,
  followClub,
  getFollowedClubs,
  getClubs,
  getIndustries,
  getStudentById,
  likePost,
} = require("../helpers/student");
const { studentGetClubResources } = require("../helpers/studentviewclubres");

const authorize = require("../helpers/authMiddleware");

router.post("/profile", authorize, editProfile);
router.get("/profile", authorize, profile);
router.post("/profile/image", authorize, image);

// following clubs
router.post("/followClub", authorize, followClub);

// ! These are both really the same endpoint - are they not?
// router.get("/following", authorize, getFollowedClubs); // ! This endpoint only returns club id's, no info
router.get("/getClubs", authorize, getClubs);

router.get("/getIndustries", authorize, getIndustries);

/**
 * @swagger
 * /student/getClubResources:
 *  post:
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              properties:
 *                clubID:
 *                  type: string
 *
 */
router.get("/getClubResources", authorize, studentGetClubResources);
router.get("/profileById", authorize, getStudentById);

router.post("/likePost", authorize, likePost);
module.exports = router;
