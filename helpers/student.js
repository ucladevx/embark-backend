const studentModel = require('../models/student')
const jwt=require("jsonwebtoken");
const ObjectID = require('mongodb').ObjectID;

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();

const imageFunction = require("../helpers/image");

exports.editProfile = async function (req, res, next) {
   const {name,major,year,tags,bio,linkedIn}=req.body;
  editableFields={name,major,year,tags,bio,linkedIn};
   const token=req.headers.authorization.split(" ")[1];
   const decodedToken=await jwt.verify(token,req.app.get('secretKey'));
   const student=await studentModel.findOne({email:decodedToken.email});
   try{
   const updatedFields = {};
   Object.keys(editableFields).forEach(key => {
   if (req.body[key]) {
       updatedFields[key] = req.body[key];
   }});
   const result=await studentModel.updateOne({_id: student._id },updatedFields);
   }
   catch(err){
       return res.json({message:err.message});
   }
   returnedStudent=await studentModel.findOne({email:decodedToken.email});
   res.send({returnedStudent});
} 

exports.profile = async function (req, res, next) {
    const token=req.headers.authorization.split(" ")[1];
    const decodedToken=await jwt.verify(token,req.app.get('secretKey'));
    const student=await studentModel.findOne({email:decodedToken.email});
    res.send({student});
}

exports.image = async function(req, res, next){
  const {pictureType}= req.query;

  const imageURL=await imageFunction(req,res,next);   //gets the aws image URL
  try{
  //finds the person and uploads their picture
  const token=req.headers.authorization.split(" ")[1];
  const decodedToken=await jwt.verify(token,req.app.get('secretKey'));
  const student=await studentModel.findOne({email:decodedToken.email});
  let updatedFields;
  console.log(pictureType);
  if(pictureType==='cover'){
    updatedFields={coverPicURL:imageURL}
  }
  else{
    updatedFields={profilePicURL:imageURL}
  }
  console.log(updatedFields)
  const result=await studentModel.updateOne({_id: student._id },updatedFields);

  console.log(imageURL);
  returnedStudent=await studentModel.findOne({email:decodedToken.email});
   res.send({returnedStudent});
  
}
catch(err){
  return res.json({message:err.message});
}
}


/*
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
  };
 
exports.image=async function(req, res, next) {
    const {pictureType}=req.body;
    aws.config.update({
        secretAccessKey: process.env.S3_ACCESS_SECRET,
        accessKeyId: process.env.S3_ACCESS_KEY,
        region: "us-west-2",
      });
      const upload = await multer({
        fileFilter,
        storage: multerS3({
          acl: "public-read",
          s3,
          bucket: "profile-pictures-embark",
          metadata: function (req, file, cb) {
            cb(null, { fieldName: "TESTING_METADATA" });
          },
          key: function (req, file, cb) {
            cb(null, Date.now().toString());
          },
        }),
      });

      const singleUpload = await upload.single("image");

      singleUpload(req, res, function (err) {
        if (err) {
          return res.json({
            success: false,
            errors: {
              title: "Image Upload Error",
              detail: err.message,
              error: err,
            },
          });
        } 
        else{
            if(pictureType==="coverPicURL"){
                return res.send({"coverPicURL":req.file.location});
            }
            else{
                return res.send({"profilePicURL":req.file.location});
            }
        
        }
    });
  }  

*/
