const studentModel = require('../models/student')
var bcrypt = require('bcryptjs');

// signin
// TODO: check credentials + jwt 
exports.signin = async function (req, res, next) {
    const {email,password}=req.body
    
    studentModel.findOne({
        email:email,
    }, function(err,studentInfo){
        if(err){
            return res.status(401).json({
                message: "Signin authentication failed--bad argument"
            });
        }
        else{
            if(bcrypt.compareSync(password, studentInfo.password)){
                const token=jwt.sign({id:studentInfo._id},req.app.get('secretKey'));
            }
            else{
                return res.status(401).json({
                    message: "Signin authentication failed--passwords don't match."
                });
            }
        }
    }
    )

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
    const hash=await bcrypt.hash(password, salt);
    student.password=hash;
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