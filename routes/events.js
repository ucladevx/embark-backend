const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require("../helpers/events");

router.get('/events', getEvents);
router.post('/create/event', createEvent);

module.exports = router;