const authorize = require("../helpers/authMiddleware");
const eventModel = require("../models/event");
const studentModel = require("../models/student");
const clubModel = require("../models/club");
const { decodeToken } = require("../helpers/utils");

async function findUser(req, res, email) {
  let user;
  if (req.body.userType === "student") {
    try {
      user = await studentModel.findOne({ email: email });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  } else if (req.body.userType === "club") {
    try {
      user = await clubModel.findOne({ email: email });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
  if (user == null) {
    res.status(400).json({
      message: "User not found",
    });
    user = -1;
  }
  return user;
}
exports.discoverEvents = async function (req, res, next) {
  let email = decodeToken(req);
  let user = await findUser(req, res, email);
  if (user == -1) {
    return;
  }
  const clubs = user.toObject().clubs;
  const tags = user.toObject().tags;

  try {
    let events = await eventModel.find({
      $or: [{ tags: { $in: tags } }, { organizerName: { $in: clubs } }],
    });
    res.status(200).json({
      events: events,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.attendEvent = async function (req, res, next) {
  let email = decodeToken(req);
  let user = await findUser(req, res, email);
  if (user == -1) {
    return;
  }
  const eventId = req.params.eventId;

  if (req.body.usertype === "student") {
    try {
      await studentModel.updateOne(
        { _id: user._id },
        { $addToSet: { events: [eventId] } }
      );
      res.status(200).send("Event added!");
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  } else if (req.body.usertype === "club") {
    try {
      await clubModel.updateOne(
        { _id: user._id },
        { $addToSet: { events: [eventId] } }
      );
      res.status(200).send("Event added!");
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
};

exports.cancelEvent = async function (req, res, next) {
  let email = decodeToken(req);
  let user = await findUser(req, res, email);
  if (user == -1) {
    return;
  }
  const eventId = req.params.eventId;

  if (req.body.usertype === "student") {
    try {
      await studentModel.updateOne(
        { _id: user._id },
        { $pullAll: { events: [eventId] } }
      );
      res.status(200).send("Event cancelled!");
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  } else if (req.body.usertype === "club") {
    try {
      await clubModel.updateOne(
        { _id: user._id },
        { $pullAll: { events: [eventId] } }
      );
      res.status(200).send("Event cancelled!");
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
};

exports.goingEvents = async function (req, res, next) {
  let email = decodeToken(req);
  let user = await findUser(req, res, email);
  if (user == -1) {
    return;
  }
  const eventsIds = user.toObject().events;
  try {
    let events = await eventModel.find({ _id: { $in: eventsIds } });
    res.status(200).json({
      events: events,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.myEvents = async function (req, res, next) {
  let email = decodeToken(req);
  let user = await findUser(req, res, email);
  if (user == -1) {
    return;
  }
  const eventsHostIds = user.toObject().eventsHost;
  try {
    let events = await eventModel.find({ _id: { $in: eventsHostIds } });
    res.status(200).json({
      events: events,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.createEvent = async function (req, res, next) {
  let email = decodeToken(req);
  let user = await findUser(req, res, email);

  if (user == -1) {
    return;
  }

  const {
    name,
    date,
    venue,
    organizerName,
    organizerEmail,
    tags,
    desc,
  } = req.body;

  const event = new eventModel({
    name,
    date,
    venue,
    organizerName,
    organizerEmail,
    tags,
    desc,
  });

  try {
    await event.save();
    await clubModel.updateOne(
      { _id: user._id },
      { $addToSet: { eventsHost: [event._id] } }
    );
    res.status(200).json({
      event: event,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
