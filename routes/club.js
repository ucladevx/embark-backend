const express = require("express");
const router = express.Router();

const { editProfile, profile, image, discover } = require("../helpers/club");
const authorize = require("../helpers/authMiddleware.js");

router.post("/profile", authorize, editProfile);
router.get("/profile", authorize, profile);

router.post("/profile/image", authorize, image)

router.get("/discover", authorize, discover);

module.exports = router;
