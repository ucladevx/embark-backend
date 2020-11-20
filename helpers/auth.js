const studentModel = require('../models/student');
const bcrypt = require('bcryptjs');

// signin
// TODO: check credentials + jwt 
exports.signin = async function (req, res, next) {
    const {name,email,password,major,year}=req.body;
    
    studentModel.findOne({
        email:email,
    }, function(err,studentInfo){
        if(err){
            return res.status(401).json({
                message: "Signin authentication failed--email not found"
            });
        }
        else{
            if(bcrypt.compareSync(password, studentInfo.password)){
                const token=jwt.sign({id:studentInfo._id},req.app.get('secretKey'),{expiresIn: 8640000});
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
    const { name, email, password,major,year } = req.body;

    const student = new studentModel({
        name,
        email,
        password,
        major,
        year
    });

    const hash=await bcrypt.hash(password, 10);
    student.password=hash;
    const token=jwt.sign({id:student._id},req.app.get('secretKey'),{expiresIn: 8640000});
    
    res.status(200).send({ auth: true, token: token });

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