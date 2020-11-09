const studentModel = require('../models/student')

// signin
// TODO: check credentials + jwt 
exports.signin = async function (req, res, next) {
    res.status(501).json({
        message: "Signin not implemented yet"
    })
}

// signup
// TODO: create jwt, hash password, change fields in studentModel
exports.signup = async function (req, res, next) {
    const { name, email, password } = req.body

    const student = new studentModel({
        name,
        email,
        password
    })

    try {
        await student.save()
    } catch (err) {
        return res.json({
            message: err.message
        })
    }

    res.status(200).json({
        message: 'Signup successful',
        name,
        email
    })
}