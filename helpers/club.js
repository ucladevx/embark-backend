const clubModel = require('../models/club')
const jwt=require("jsonwebtoken");
const imageFunction = require("../helpers/image");


exports.editProfile = async function (req, res, next) {
    const {name,tags,description,profilePicURL,coverPicURL,website}=req.body;
    editableFields={name,tags,description,profilePicURL,coverPicURL,website};
    const token=req.headers.authorization.split(" ")[1];
    const decodedToken=await jwt.verify(token,req.app.get('secretKey'));
    const club=await clubModel.findOne({email:decodedToken.email});
    try{
    const updatedFields = {};
    Object.keys(editableFields).forEach(key => {
    if (req.body[key]) {
        updatedFields[key] = req.body[key];
    }});
    const result=await clubModel.updateOne({_id: club._id },updatedFields);
    }
    catch(err){
        return res.json({message:err.message});
    }
    returnedClub=await clubModel.findOne({email:decodedToken.email});
    res.send({returnedClub});
}

exports.profile = async function (req, res, next) {
    const token=req.headers.authorization.split(" ")[1];
    const decodedToken=await jwt.verify(token,req.app.get('secretKey'));
    const club=await clubModel.findOne({email:decodedToken.email});
    res.send({club});
}

exports.image = async function(req, res, next){
  const {pictureType}= req.query;
  const imageURL=await imageFunction(req,res,next);   //gets the aws image URL

  try{
    const token=req.headers.authorization.split(" ")[1];
    const decodedToken=await jwt.verify(token,req.app.get('secretKey'));
    const club=await clubModel.findOne({email:decodedToken.email});
    let updatedFields;
    if(pictureType==='cover'){
      updatedFields={coverPicURL:imageURL}
    }
    else{
      updatedFields={profilePicURL:imageURL}
    }
  //finds the person and uploads their picture
  
  const result=await clubModel.updateOne({_id: club._id },updatedFields);

  console.log(imageURL);
  returnedClub=await clubModel.findOne({email:decodedToken.email});
   res.send({returnedClub});
  
}
catch(err){
  return res.json({"message":"ID not found (it is likely the token is incorrect)"});
}
}