const studentModel = require('../models/student')

function getStudentFromToken(token,email){
    const decodedToken=jwt.verify(token,req.app.get('secretKey'));
    return studentModel.findOne({email:decodedToken.email});
}
exports.editProfile = async function (req, res, next) {
    const {name,email,major,year,tags,bio,profilePicURL,coverPicURL,linkedIn}=req.body;
    try{
    const token=req.headers.authorization.split(" ")[1];
    const student=getStudentFromToken(token);
    studentModel.updateOne({id:student._id},
        {$set: {
            "name": name,
            "email":email,
            "major":major,
            "year":year,
            "tags":tags,
            "bio":bio,
            "profilePicURL":profilePicURL,
            "coverPicURL":coverPicURL,
            "linkedIn":linkedIn

        }});
    }
    catch(err){
        return res.json({message:err.message});
    }
    res.redirect('/profile');
} 

exports.profile = async function (req, res, next) {
    const token=req.headers.authorization.split(" ")[1];
    const student=getStudentFromToken(token);
    res.status(501).json({
        message: "Not implemented yet"
    })
}
