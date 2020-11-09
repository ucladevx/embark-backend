const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    major: {
        type: String,
    },
    year: {
        type: Number
    }
})

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
