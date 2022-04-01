const AWS = require("aws-sdk");
const Busboy = require("busboy");
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_ACCESS_SECRET,
});
const S3 = new AWS.S3();

async function uploadFile(buffer, fileParams) {
  return new Promise((resolve, reject) => {
    // or module.exports = (buffer, fileParams) => {
    // let mkey=parseInt(Math.random()*1000).toString()+fileParams.fileName; //just to make sure files with same name are differentiated
    let mmkey = parseInt(Date.now()).toString() + fileParams.fileName;
    const params = {
      Bucket: "post-resources-bucket",
      Key: mmkey,
      Body: buffer,
      ACL: "public-read",
      ContentType: fileParams.fileType,
      ContentEncoding: fileParams.fileEnc,
    };
    console.log("starting upload for..." + fileParams.fileName);
    try {
      resolve(S3.upload(params).promise());
    } catch (err) {
      reject(err);
    }
  });
}

const parseForm = async (req) => {
  return new Promise((resolve, reject) => {
    const form = new Busboy({ headers: req.headers });
    const files = []; // create an empty array to hold the processed files
    const buffers = {}; // create an empty object to contain the buffers
    form.on("file", (field, file, filename, enc, mime) => {
      buffers[field] = []; // add a new key to the buffers object
      file.on("data", (data) => {
        buffers[field].push(data);
      });
      file.on("end", () => {
        files.push({
          fileBuffer: Buffer.concat(buffers[field]),
          fileType: mime,
          fileName: filename,
          fileEnc: enc,
        });
      });
    });
    form.on("error", (err) => {
      reject(err);
    });
    form.on("finish", () => {
      resolve(files);
    });
    req.pipe(form); // pipe the request to the form handler
  });
};
//const uploadFile = require("../helpers/upload");

module.exports = async (req, res) => {
  const { linkFile, userNamed } = req.query;
  try {
    if (linkFile == "file") {
      const files = await parseForm(req);
      //storing the names and the types of the files
      const fileResult = [];
      for (let file of files) {
        fileResult.push({ file: file.fileName, fileType: file.fileType });
      }

      //figure this one out
      let locations = [];
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        const { fileBuffer, ...fileParams } = file;
        const result = await uploadFile(fileBuffer, fileParams);
        //console.log(result)
        //fileResult[i]["location"].push(result.Location)
        locations.push(result);
      }
      //clean output
      // console.log(locations);
      for (let i = 0; i < locations.length; i++) {
        locations[i]["Name"] = locations[i]["Key"].substr(13);
        locations[i]["userNamed"] = userNamed;
        delete locations[i]["ETag"];
        if (locations[i]["key"]) {
          delete locations[i]["key"];
        }
      }

      return res.status(200).json({ success: true, fileUrls: locations });
    } else {
      const { link } = req.body;
      return res.status(200).json({ success: true, fileUrls: { link } });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
