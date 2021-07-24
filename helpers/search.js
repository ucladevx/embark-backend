const clubModel = require("../models/club");
const studentModel = require("../models/student");
const eventModel = require("../models/event");

exports.completeSearch = async function (req, res) {
  try {
    const { searchString } = req.body;
    let resultsList = [];
    // search through club DB
    let searchResultClubs = await clubModel.find({
      $text: { $search: searchString },
    });
    for (i = 0; i < searchResultClubs.length; i++) {
      resultsList.push({
        name: searchResultClubs[i].name,
        id: searchResultClubs[i]._id,
        accountType: "club",
      });
    }
    // search through students DB
    // let searchResultStudents = await studentModel.find({$text: {$search: searchString}})
    // search for students, depending on whether use provided first name, last name, or both
    let searchResultStudents = [];
    if (searchString.includes(" ")) {
      const words = searchString.split(" ");
      searchResultStudents = await studentModel.find({
        $or: [
          { firstName: searchString },
          { lastName: searchString },
          { firstName: words[0], lastName: words[1] },
        ],
      });
    } else {
      searchResultStudents = await studentModel.find({
        $or: [{ firstName: searchString }, { lastName: searchString }],
      });
    }

    for (i = 0; i < searchResultStudents.length; i++) {
      // console.log(searchResultStudents[i])
      resultsList.push({
        firstName: searchResultStudents[i].firstName,
        lastName: searchResultStudents[i].lastName,
        id: searchResultStudents[i]._id,
        accountType: "student",
      });
    }

    // search through club DB
    let searchResultEvents = await eventModel.find({
      $text: { $search: searchString },
    });
    for (i = 0; i < searchResultEvents.length; i++) {
      resultsList.push({
        name: searchResultEvents[i].name,
        id: searchResultEvents[i]._id,
        accountType: "event",
      });
    }

    // returns a list of objects that match and the size of the list
    return res.status(200).json({
      queries: resultsList,
      numQueries: resultsList.length,
    });
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
