const express = require("express");
const router = express.Router();
const { editProfile, profile, image } = require("../helpers/club")
const resourceFunction = require("../helpers/resources-busboy");


router.post("/profile", editProfile)
router.get("/profile", profile)

router.post("/profile/image", image)
router.post("/resources",resourceFunction)
router.get("/resources") //add some resouces array to club model
// router.get("/profile/image")
module.exports = router;