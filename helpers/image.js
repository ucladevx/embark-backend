const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();
/*
module.exports=async(req,res,next) => {

  var multipartParams = {
    Bucket: "profile-pictures-embark",
    Key: "file",
    ContentType: file.type
  };
  s3.createMultipartUpload(multipartParams, function(mpErr, multipart) {
    if (mpErr) return console.error('Error!', mpErr);
    console.log('Got upload ID', multipart.UploadId);

    for (var start = 0; start < buffer.length; start += partSize) {
      partNum++;
      var end = Math.min(start + partSize, buffer.length);
      var partParams = {
        Body: buffer.slice(start, end),
        Bucket: multipartParams.Bucket,
        Key: multipartParams.Key,
        PartNumber: String(partNum),
        UploadId: multipart.UploadId
      };

      console.log('Uploading part: #', partParams.PartNumber, ', Start:', start);
      uploadPart(s3, multipart, partParams);
    }
  });
}*/

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

module.exports = async (req, res, next) => {
  return new Promise(async function (resolve, reject) {
    const { pictureType } = req.body;
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
        bucket: "profile-picture-embark",
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
      } else {
        let fileLocation = "";
        if (req.file != undefined) {
          fileLocation = req.file.location;
        }
        resolve(fileLocation);
        return fileLocation;
      }
    });
  });
};
