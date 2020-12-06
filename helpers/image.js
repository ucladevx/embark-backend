const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
  };

module.exports=async(req,res,next) => {
    console.log(req.file);
    //if((req.file!==null) && (req.file!==undefined)){
    return new Promise(async function(resolve,reject){ 
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
                const fileLocation=req.file.location;
                console.log("File image",fileLocation);
                resolve(fileLocation);
                
            }
        });
        
    })
    
//}
}