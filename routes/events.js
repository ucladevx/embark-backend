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
  updateEvent,
} = require("../helpers/events");

//for clubs + students
router.get("/discover", authorize, discoverEvents);
router.post("/:eventId/attend", authorize, attendEvent);
router.post("/:eventId/cancel", authorize, cancelEvent);
router.get("/going", authorize, goingEvents);

// for clubs
router.get("/me", authorize, myEvents);

/**
 * @swagger
 * /events/create:
 *  post:
 *    tags:
 *      - Events
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              properties:
 *                name:
 *                  type: string
 *                startDate:
 *                  type: string
 *                endDate:
 *                  type: string
 *                venue:
 *                  type: string
 *                organizerName:
 *                  type: string
 *                organizerEmail:
 *                  type: string
 *                tags:
 *                  type: string
 *                desc:
 *                   type: string
 */
router.post("/create", authorize, createEvent);
router.post("/update", authorize, updateEvent);

module.exports = router;
