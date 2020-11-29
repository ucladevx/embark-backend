const express = require("express");
const router = express.Router();

const { editProfile, profile } = require("../helpers/student")

router.post("/profile", editProfile)
router.get("/profile", profile)

module.exports = router;