const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();
const fs = require('fs');

//https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/

const fileFilter = (req, file, cb) => {
    
      cb(null, true);
    
  };

module.exports=async(req,res,next) => {

    return new Promise(async function(resolve,reject){ 
        const {pictureType}=req.body;
        aws.config.update({
            secretAccessKey: process.env.S3_ACCESS_SECRET,
            accessKeyId: process.env.S3_ACCESS_KEY,
            region: "us-west-2", 
          });
          const upload = await multer({
           
            storage: multerS3({
              acl: "public-read",
              s3,
              bucket: "club-resources-embark",
              metadata: function (req, file, cb) {
                cb(null, { fieldName: "TESTING_METADATA" });
              },
              key: function (req, file, cb) {
                cb(null, Date.now().toString());
              },
            }),
          });
          var options = { partSize: 5 * 1024 * 1024, queueSize: 10 };  

          const multipleUpload = await upload.array("file",options);
    
          multipleUpload(req, res, function (err) {
            if (err) {
              return res.json({
                success: false,
                errors: {
                  title: "File Upload Error",
                  detail: err.message,
                  error: err,
                },
              });
            }
            else{
                let fileLocation=[];
               // console.log(req.files);
                if(req.files!=undefined){
                    for (upFile of req.files){
                        fileLocation.push(upFile.location);
                    }
                }
                resolve(fileLocation);
                //console.log("hello");
                res.send({"uploadedResources":fileLocation});
                
            }
        });
        
    })
    

}