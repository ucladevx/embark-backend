const clubModel = require("../models/club");

exports.studentGetClubResources = async function (req, res, next) {
  //so that students can access club resources
  const { clubID } = req.body;
  const getClub = await clubModel.findOne({ _id: clubID });
  return res.status(200).json({
    success: true,
    resources: getClub["resources"],
    embededlinks: getClub["embededlinks"],
  });
};
