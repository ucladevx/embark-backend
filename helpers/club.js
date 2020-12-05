const clubModel = require('../models/club')
const jwt=require("jsonwebtoken");


exports.editProfile = async function (req, res, next) {
    const {name,tags,description,profilePicURL,coverPicURL,website}=req.body;
    editableFields={name,tags,description,profilePicURL,coverPicURL,website};
    const token=req.headers.authorization.split(" ")[1];
    const decodedToken=await jwt.verify(token,req.app.get('secretKey'));
    const club=await clubModel.findOne({email:decodedToken.email});
    try{
    const updatedFields = {};
    await Object.keys(editableFields).forEach(key => {
    if (req.body[key]) {
        updatedFields[key] = req.body[key];
    }});
    console.log(updatedFields)
    const result=await clubModel.updateOne({_id: club._id },updatedFields);
    }
    catch(err){
        return res.json({message:err.message});
    }
    res.send({club});
}

exports.profile = async function (req, res, next) {
    const token=req.headers.authorization.split(" ")[1];
    const decodedToken=jwt.verify(token,req.app.get('secretKey'));
    const club=clubModel.findOne({email:decodedToken.email});
    res.status(200).send({club});
}
