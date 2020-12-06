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