const studentModel = require('../models/student')
const jwt=require("jsonwebtoken");
const ObjectID = require('mongodb').ObjectID;



exports.editProfile = async function (req, res, next) {
   const {name,major,year,tags,bio,profilePicURL,coverPicURL,linkedIn}=req.body;
   editableFields={name,major,year,tags,bio,profilePicURL,coverPicURL,linkedIn};
   const token=req.headers.authorization.split(" ")[1];
   const decodedToken=await jwt.verify(token,req.app.get('secretKey'));
   const student=await studentModel.findOne({email:decodedToken.email});
   try{
   const updatedFields = {};
   await Object.keys(editableFields).forEach(key => {
   if (req.body[key]) {
       updatedFields[key] = req.body[key];
   }});
   console.log(updatedFields)
   const result=await studentModel.updateOne({_id: student._id },updatedFields);
   }
   catch(err){
       return res.json({message:err.message});
   }
   res.send({student});
} 

exports.profile = async function (req, res, next) {
    const token=req.headers.authorization.split(" ")[1];
    const decodedToken=jwt.verify(token,req.app.get('secretKey'));
    const student=studentModel.findOne({email:decodedToken.email});
    res.status(200).send({student});
}
