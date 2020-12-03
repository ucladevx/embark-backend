const studentModel = require('../models/student')

exports.editProfile = async function (req, res, next) {
    const {name,email,major,year,tags}=req.body;
    
    const token=req.headers.authorization.split(" ")[1];
    const decodedToken=jwt.verify(token,req.app.get('secretKey'));
    const student=studentModel.findOne({email:decodedToken.email});
    studentModel.updateOne({id:student._id},
        {$set: {
            "name": name,
            "email":email,
            "major":major,
            "year":year,
            "tags":tags
        }},(err)=>{
            if(err){
                throw err;
            }
        }
        );
    
    
    res.redirect('/profile');
}

exports.profile = async function (req, res, next) {
    res.status(501).json({
        message: "Not implemented yet"
    })
}
