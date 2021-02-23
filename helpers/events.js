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
      return res.status(400).json({
        message: err.message,
      });
    }
  } else if (req.body.userType === "club") {
    try {
      user = await clubModel.findOne({ email: email });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }
  if (user == null) {
    return res.status(400).json({
      message: "User not found",
    });
    user = -1;
  }
  return user;
}
exports.discoverEvents = async function (req, res, next) {
  let { email } = decodeToken(req);
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
    return res.status(200).json({
      events: events,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.attendEvent = async function (req, res, next) {
  let { email } = decodeToken(req);
  let user = await findUser(req, res, email);
  if (user == -1) {
    return;
  }

  const eventId = req.params.eventId;
  if ((await findEvent(eventId)) === false) {
    return res.status(400).json({
      message: `Event of id: ${eventId} not found!`,
    });
  }

  if (req.body.userType === "student") {
    try {
      await studentModel.updateOne(
        { _id: user._id },
        { $addToSet: { events: [eventId] } }
      );
      return res.status(200).send("Event added!");
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  } else if (req.body.userType === "club") {
    try {
      await clubModel.updateOne(
        { _id: user._id },
        { $addToSet: { events: [eventId] } }
      );
      return res.status(200).send("Event added!");
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }
};

exports.cancelEvent = async function (req, res, next) {
  let { email } = decodeToken(req);
  let user = await findUser(req, res, email);
  if (user == -1) {
    return;
  }
  const eventId = req.params.eventId;
  if ((await findEvent(eventId)) === false) {
    return res.status(400).json({
      message: `Event of id: ${eventId} not found!`,
    });
  }

  if (req.body.userType === "student") {
    try {
      await studentModel.updateOne(
        { _id: user._id },
        { $pullAll: { events: [eventId] } }
      );
      return res.status(200).send("Event cancelled!");
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  } else if (req.body.userType === "club") {
    try {
      await clubModel.updateOne(
        { _id: user._id },
        { $pullAll: { events: [eventId] } }
      );
      return res.status(200).send("Event cancelled!");
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }
};

exports.goingEvents = async function (req, res, next) {
  let { email } = decodeToken(req);
  let user = await findUser(req, res, email);
  if (user == -1) {
    return;
  }
  const eventsIds = user.toObject().events;
  try {
    let events = await eventModel.find({ _id: { $in: eventsIds } });
    return res.status(200).json({
      events: events,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.myEvents = async function (req, res, next) {
  let { email } = decodeToken(req);
  let user = await findUser(req, res, email);
  if (user == -1) {
    return;
  }
  const eventsHostIds = user.toObject().eventsHost;
  try {
    let events = await eventModel.find({ _id: { $in: eventsHostIds } });
    return res.status(200).json({
      events: events,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

exports.createEvent = async function (req, res, next) {
  let { email } = decodeToken(req);
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
    return res.status(200).json({
      event: event,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

async function findEvent(eventID) {
  try {
    await eventModel.findOne({ _id: eventID });
    return true;
  } catch (err) {
    return false;
  }
}
