const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({ httpOptions: { timeout: 10 * 60 * 1000 } });

module.exports = async (req, res, bucketName) => {
  let files = [];
  return new Promise(async function (resolve, reject) {
    aws.config.update({
      secretAccessKey: process.env.S3_ACCESS_SECRET,
      accessKeyId: process.env.S3_ACCESS_KEY,
      region: "us-west-2",
    });
    const upload = await multer({
      storage: multerS3({
        acl: "public-read",
        s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
          cb(null, {
            fieldName: "TESTING_METADATA",
          });
          files.push(file);
        },
        key: function (req, file, cb) {
          cb(null, Date.now().toString());
        },
      }),
    });
    //var readStream = fs.createReadStream(req.files.location);
    // var params = {Body: readStream};
    var options = { partSize: 5 * 1024 * 1024, queueSize: 10 };

    const multipleUpload = await upload.array("file", options);

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
      } else {
        let fileLocation = [];
        if (req.files != undefined) {
          for (upFile of req.files) {
            fileLocation.push(upFile.location);
          }
        }
        resolve(fileLocation);
        for (i = 0; i < fileLocation.length; i++) {
          files[i]["location"] = fileLocation[i];
        }
        return res.send({ files: files });
      }
    });
  });

  //get the token and add the resources to the clubModel
  //const token = req.headers.authorization.split(" ")[1];
  //const decodedToken = jwt.verify(token, req.app.get('secretKey'));
};
