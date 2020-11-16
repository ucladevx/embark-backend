const studentModel = require('../models/student')
var bcrypt = require('bcryptjs');

// signin
// TODO: check credentials + jwt 
exports.signin = async function (req, res, next) {
    res.status(501).json({
        message: "Signin not implemented yet"
    })
    const Student=this;
    const compare=bcrypt.compareSync(password, Student.password);

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

    const salt=genSaltSync(10);
    const Student=this;
    const hash=await hashSync(password, salt);
    this.password=hash;
    next();

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