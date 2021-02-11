const authorize = require("../helpers/authMiddleware");
const eventModel = require('../models/event');
const studentModel = require('../models/student');
const clubModel = require('../models/club');

async function findUser(req, decodedToken) {
    let user;
    if (req.body.usertype === "student") {
        try {
            user = await studentModel.findOne({ email: decodedToken.email });
        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    } else if (req.body.usertype === "club") {
        try {
            user = await clubModel.findOne({ email: decodedToken.email });
        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    }
    return user;
}
exports.discoverEvents = async function (req, res, next) {
    const decodedToken = await authorize(req, res, next);
    let user = await findUser(req, decodedToken);

    const clubs = user.toObject().clubs;
    const tags = user.toObject().tags;
    try {
        let events = await eventModel.find({
            $or: [{ "tags": { $in: tags } }, { "organizerName": { $in: clubs } }]
        })
        res.status(200).json({
            events: events
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}

exports.attendEvent = async function (req, res, next) {
    const decodedToken = await authorize(req, res, next);
    let user = await findUser(req, decodedToken);
    const eventId = req.params.eventId;

    if (req.body.usertype === "student") {
        try {
            await studentModel.updateOne({ _id: user._id }, { $addToSet: { events: [eventId] } })
        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    } else if (req.body.usertype === "club") {
        try {
            await clubModel.updateOne({ _id: user._id }, { $addToSet: { events: [eventId] } })
        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    }
}

exports.cancelEvent = async function (req, res, next) {
    const decodedToken = await authorize(req, res, next);
    let user = await findUser(req, decodedToken);
    const eventId = req.params.eventId;

    if (req.body.usertype === "student") {
        try {
            await studentModel.updateOne({ _id: user._id }, { $pullAll: { events: [eventId] } })
        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    } else if (req.body.usertype === "club") {
        try {
            await clubModel.updateOne({ _id: user._id }, { $pullAll: { events: [eventId] } })
        } catch (err) {
            res.status(400).json({
                message: err.message
            });
        }
    }
}

exports.goingEvents = async function (req, res, next) {

    const decodedToken = await authorize(req, res, next);
    let user = await findUser(req, decodedToken);

    const events = user.toObject().events;
    res.status(200).json({
        events: events
    })

}

exports.myEvents = async function (req, res, next) {

    const decodedToken = await authorize(req, res, next);

    let club;
    try {
        club = await clubModel.findOne({ email: decodedToken.email });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }

    const events = club.toObject().events;
    res.status(200).json({
        events: events
    })

}

exports.createEvent = async function (req, res, next) {

    const decodedToken = await authorize(req, res, next);
    let user = await findUser(req, decodedToken);

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
        await clubModel.updateOne({ _id: user._id }, { $addToSet: { events: [event._id] } })
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};