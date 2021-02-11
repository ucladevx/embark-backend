const authorize = require("../helpers/authMiddleware");
const eventModel = require('../models/event');
const studentModel = require('../models/student');

exports.getEvents = async function (req, res, next) {
    const decodedToken = await authorize(req, res, next);
    var student;
    try {
        student = await studentModel.findOne({ email: decodedToken.email });
    } catch (err) {


    }
    const clubs = student.toObject().clubs;
    const tags = student.toObject().tags;
    try {
        let events = await eventModel.find({
            $or: [{ "tags": { $in: tags } }, { "organizerName": { $in: clubs } }]

        })

        res.status(200).json({
            events: events
        })
    } catch (err) {

    }
}

exports.createEvent = async function (req, res, next) {
    const {
        name,
        date,
        venue,
        organizerName,
        organizerEmail,
        attend,
        tags,
        desc,
    } = req.body;

    const event = new eventModel({
        name,
        date,
        venue,
        organizerName,
        organizerEmail,
        attend,
        tags,
        desc,
    });

    try {
        await event.save();
        res.status(201);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};