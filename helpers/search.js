const clubModel = require('../models/club')
const studentModel = require('../models/student')


exports.completeSearch = async function (req, res) {
    try{
      const {searchString} = req.body;
      let resultsList = []
      // search through club DB
      let searchResultClubs = await clubModel.find({$text: {$search: searchString}})
      for (i = 0; i < searchResultClubs.length; i++) {
        resultsList.push({
            name: searchResultClubs[i].name,
            id: searchResultClubs[i]._id, 
            accountType: 'club'
        })
      }
      // search through students DB
      let searchResultStudents = await studentModel.find({$text: {$search: searchString}})
      for (i = 0; i < searchResultStudents.length; i++) {
        resultsList.push({
            name: searchResultStudents[i].name,
            id: searchResultStudents[i]._id,
            accountType: 'student'})
      }
      // returns a list of objects that match and the size of the list
      res.status(200).json({
        queries: resultsList,
        numQueries: resultsList.length
      })
    }catch(e) {
      res.status(400).json({
        message: e.message
      })
    }
  }