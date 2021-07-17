//returns a list of clubs at /getclubs endpoint
const studentModel = require("../models/student");

//give an id and get a user's posts
exports.returnUserPosts = async function (req, res, next) {
  const { student_id } = req.body;
  let posts = await studentModel.findOne({ _id: student_id }, "posts");

  try {
    return res.status(400).json(posts);
  } catch (err) {
    console.log(err);
  }
};
