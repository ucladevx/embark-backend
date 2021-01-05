const studentModel = require('../models/student');
const clubModel = require('../models/club');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signin = async function (req, res, next) {
    const { email, password } = req.body;

    try {
        let userInfo;
        if (req.body.userType === "club") {
            userInfo = await clubModel.findOne({
                email: email,
            })
        }
        else {
            userInfo = await studentModel.findOne({
                email: email,
            })
        }

        console.log(userInfo);
        if (bcrypt.compare(password, userInfo.password)) {
            const token = jwt.sign({ id: userInfo._id, name: userInfo.name, email: email }, req.app.get('secretKey'), { expiresIn: 8640000 });
            res.send({ token: token });
        }
        else {
            return res.status(401).json({
                message: "Incorrect Password"
            });
        }

    } catch (err) {
        console.log(err.message);
        return res.status(401).json({
            message: "Email not found"

        });
    }

}

// signup
// TODO: create jwt, hash password, change fields in studentModel
exports.signup = async function (req, res, next) {
    const { name, email, password } = req.body;


    const regExpPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if (!regExpPassword.test(password)) {
        return res.status(400).send({ message: "Password must be 8 characters, must have one Uppercase, one Lowercase, and one special character" });
    }
    if (req.body.userType == "student") {
        const student = new studentModel({
            name,
            email,
            password,
            major: "",
            year: "",
            posts: [],
            tags: [],
            savedPosts: [],
            clubs: []
        });
        student.password = await bcrypt.hashSync(password, 10);
        const token = jwt.sign({ id: student._id, name: name, email: email }, req.app.get('secretKey'), { expiresIn: 8640000 });

        try {
            await student.save()
            res.status(200).send({ auth: true, token: token });
        } catch (e) {
            return res.json({ message: e.message });
        }
    }
    if (req.body.userType == "club") {
        const club = new clubModel({
            name,
            email,
            password,
            savedPosts: []
        });
        club.password = await bcrypt.hashSync(password, 10);
        const token = jwt.sign({ id: club._id, name: name, email: email }, req.app.get('secretKey'), { expiresIn: 8640000 });

        try {
            await club.save()
            res.status(200).send({ auth: true, token: token });
        } catch (e) {
            return res.json({ message: e.message });
        }
    }

}

