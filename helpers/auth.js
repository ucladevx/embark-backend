const studentModel = require('../models/student');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');

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
                const token=jwt.sign({id:studentInfo._id,name:name,email:email,major:major,year:year},req.app.get('secretKey'),{expiresIn: 8640000});
                res.send({token:token,password:password});
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
        student.password=await bcrypt.hashSync(password, 10);
        const token=jwt.sign({id:student._id,name:name,email:email,major:major,year:year},req.app.get('secretKey'),{expiresIn: 8640000});
        try {
            await student.save()
            res.status(200).send({ auth: true, token: token });
    } catch(e) {
            if(e.code === 11000) {
                res.send('That email address is already registered');    
            }
            else{
            return res.json({message: e.message});
            }
        }
    
}

