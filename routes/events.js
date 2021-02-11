const express = require('express');
const router = express.Router();
const { discoverEvents, createEvent, attendEvent, cancelEvent, goingEvents, myEvents } = require("../helpers/events");

//for clubs + students
router.get('/discover', discoverEvents);
router.post('/:eventId/attend', attendEvent);
router.post('/:eventId/cancel', cancelEvent);
router.get('/going', goingEvents);

// for clubs
router.get('/me', myEvents);
router.post('/create', createEvent);

module.exports = router;