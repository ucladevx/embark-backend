const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
  },
  organizerName: {
    type: String,
    //required: true
  },
  organizerEmail: {
    type: String,
    //required: true
  },
  tags: {
    type: [String],
  },
  desc: {
    type: String,
  },
  attendees: {
    type: [],
  },
});
eventSchema.index({ name: "text" });

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
