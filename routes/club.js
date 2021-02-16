const express = require("express");
const router = express.Router();
const { editProfile, profile, image, discover } = require("../helpers/club")

router.post("/profile", editProfile)
router.get("/profile", profile)

router.post("/profile/image", image)

router.get("/discover", discover);
module.exports = router;