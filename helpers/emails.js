const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const studentModel = require('../models/student')
const clubModel = require('../models/club')
const PasswordResetHTML = require('../mjml/paasswordReset.js');

exports.forgotPass = async function (req, res, next) {
    const email = req.body.email;
    if (email !== undefined) {
        const token = jwt.sign({ email: email }, req.app.get('secretKey'), { expiresIn: 8640000 })
        try {
            const msg = {
                to: email,
                from: 'theembarkteam@gmail.com',
                subject: 'Embark: Password Reset',
                substitutionWrappers: ['{{', '}}'],
                substitutions: {
                    resetLink: `http://localhost:8000/${token}`
                },
                html: PasswordResetHTML
            }
            await sendMail(msg);
            return res.status(200).json({
                message: "Reset email sent!"
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    } else {
        return res.status(400).json({
            message: "Email required!"
        })
    }
}

exports.resetPass = async function (req, res, next) {
    const token = req.params.token;
    if (token !== undefined) {
        try {
            const decodedToken = jwt.verify(token, req.app.get('secretKey'));
            res.redirect(`/changePassword:/${token}`);
        } catch (err) {//maybe redirect to login page
            return res.status(401).json({
                message: error.message
            });
        }
    }
}

exports.changePass = async function (req, res, next) {
    const token = req.params.token;

    if (token !== undefined) {
        try {
            const decodedToken = jwt.verify(token, req.app.get('secretKey'));
            let password = await bcrypt.hashSync(req.body.password, 10)
            let student = await studentModel.findOneAndUpdate({ email: decodedToken.email }, {
                password = password
            });

            return res.status(200).send({ auth: true, token: token });
        } catch (err) {//maybe redirect to login page
            return res.status(401).json({
                message: error.message
            });
        }
    }
}

async function sendMail(msg) {
    sgMail
        .send(msg)
        .then(() => {
            //console.log('Email sent')
        })
        .catch((error) => {
            throw error;
        })
}