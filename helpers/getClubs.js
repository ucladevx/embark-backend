//returns a list of clubs at /getclubs endpoint
const clubModel = require("../models/club");

exports.returnClubs = async function (req, res, next) {
  clubModel.find({}, { name: 1 }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      return res.status(400).json(result);
    }
  });
};
