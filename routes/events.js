const express = require("express");
const router = express.Router();
const authorize = require("../helpers/authMiddleware");
const {
  discoverEvents,
  createEvent,
  attendEvent,
  cancelEvent,
  goingEvents,
  myEvents,
} = require("../helpers/events");

//for clubs + students
router.get("/discover", authorize, discoverEvents);
router.post("/:eventId/attend", authorize, attendEvent);
router.post("/:eventId/cancel", authorize, cancelEvent);
router.get("/going", authorize, goingEvents);

// for clubs
router.get("/me", authorize, myEvents);
router.post("/create", authorize, createEvent);

module.exports = router;
