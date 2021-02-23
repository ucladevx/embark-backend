const express = require("express");
const router = express.Router();

const { editProfile, profile, image, discover } = require("../helpers/club");
const authorize = require("../helpers/authMiddleware.js");
const resourceFunction = require("../helpers/resources-busboy");

router.post("/profile", editProfile)
router.get("/profile", profile)

router.post("/profile/image", image)

router.post("/resources",resourceFunction)

router.get("/discover", authorize, discover);

module.exports = router;