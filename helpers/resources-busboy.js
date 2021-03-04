const AWS = require('aws-sdk');
const Busboy = require('busboy');
AWS.config.update({ accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_ACCESS_SECRET });
const S3 = new AWS.S3();

async function uploadFile (buffer, fileParams) {
  return new Promise((resolve, reject) => {
  // or module.exports = (buffer, fileParams) => {
   // let mkey=parseInt(Math.random()*1000).toString()+fileParams.fileName; //just to make sure files with same name are differentiated
    let mmkey=parseInt(Date.now()).toString()+fileParams.fileName;
        const params = {
          Bucket: 'club-resources-embark',
          Key: mmkey,
          Body: buffer,
          ACL: 'public-read',
          ContentType: fileParams.fileType,
          ContentEncoding: fileParams.fileEnc,
        }
    console.log("starting upload for..."+fileParams.fileName);
    try{
      resolve(S3.upload(params).promise()) 
    }
    catch(err){
      reject(err);
    }
  })
  }

const parseForm = async req => {
  return new Promise((resolve, reject) => {
    const form = new Busboy({ headers: req.headers })
    const files = [] // create an empty array to hold the processed files
    const buffers = {} // create an empty object to contain the buffers
    form.on('file', (field, file, filename, enc, mime) => {
      buffers[field] = [] // add a new key to the buffers object
      file.on('data', data => {
        buffers[field].push(data)
      })
      file.on('end', () => {
        files.push({
          fileBuffer: Buffer.concat(buffers[field]),
          fileType: mime,
          fileName:filename,
          fileEnc: enc,
        })
      })
    })
    form.on('error', err => {
      reject(err)
    })
    form.on('finish', () => {
      resolve(files)
    })
    req.pipe(form) // pipe the request to the form handler
  })
}
//const uploadFile = require("../helpers/upload");

module.exports = async (req, res) => {
// or module.exports = async (req, res) => {
  try {
    const files = await parseForm(req)
    //storing the names and the types of the files
    const fileResult=[]
    for (file of files){
      fileResult.push({"file":file.fileName,"fileType":file.fileType});
    }

    //figure this one out
    let locations=[]
    
    for (i=0;i<files.length;i++) {
      file=files[i];
      const { fileBuffer, ...fileParams } = file
      const result = await uploadFile(fileBuffer, fileParams)
      //console.log(result)
      //fileResult[i]["location"].push(result.Location)
      locations.push(result)
    }

    res.status(200).json({ success: true,fileUrls: locations })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err.message })
  }
}







/**
 * route where we get multipart form data
 * capture file and upload files to s3
 * 
 */
/*
module.exports=async(req,res,next) => {
    let chunks = [], fname, ftype, fEncoding;
    //new code
    

    let busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        fname = filename.replace(/ /g,"_");
        ftype = mimetype;
        fEncoding = encoding;
        file.on('data', function(data) {
            // you will get chunks here will pull all chunk to an array and later concat it.
           // console.log (chunks.length);
            chunks.push(data)
        });
        file.on('end', function() {
            console.log('File [' + filename + '] Finished');
        });
    });
    req.pipe(busboy);
    busboy.on('finish', function() {
        const params = {
            Bucket: 'club-resources-embark', // your s3 bucket name
            Key: `${fname}`, 
            Body: Buffer.concat(chunks), // concatinating all chunks
            ACL: 'public-read',
            ContentEncoding: fEncoding, // optional
            ContentType: ftype // required
        }
        // we are sending buffer data to s3.
        S3.upload(params, (err, s3res) => {
            if (err){
              res.send({err, status: 'error'});
            } else {
              res.send({data:s3res, status: 'success', msg: 'File successfully uploaded.'});
            }
        });
        
    });
    
}
*/
/*
function printTheS3(s3info){
    console.log(s3info);
}
async function uploadToMyS3(fname,fbuffers,enc,ftype){
    return new Promise(async function(resolve,reject){ 

        console.log("Uploading to S3..."+fname);
          const params = {
            Bucket: 'club-resources-embark', 
            Key: `${fname}`,//+Date.now().toString(), REMEMBER TO ADD THIS COMMENT BACK IN!!!!!!!!!!!!!!
            Body: fbuffers, 
            ACL: 'public-read',
            ContentEncoding: enc, // optional
            ContentType: ftype // required
        }    
        
        S3.upload(params, (err, s3res) => {
            if (err){
                reject(err)
            } else{
                resolve(s3res);
                return s3res;
            }
            
        });
    })
}

module.exports=async(req,res,next) => {
    return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers })
    const files = [] // create an empty array to hold the processed files
    const buffers = {}
    const s3info=[]
    let fname, fbuffers,ftype;
    let fileInfo;
    // create an empty object to contain the buffers
    busboy.on('file', (field, file, filename, enc, mime) => {
        ftype=mime;
        fname = filename.replace(/ /g,"_");
        console.log("starting... "+filename)
        buffers[field] = [] // add a new key to the buffers object

        file.on('data', data => {
            buffers[field].push(data)
        })
        fbuffers=Buffer.concat(buffers[field])
        file.on('end', () => {
            files.push({
                fileBuffer: fbuffers,
                fileType: mime,
                fileName: filename,
                fileEnc: enc,
            })
            console.log("Finished with "+filename);
            fileInfo=uploadToMyS3(fname,fbuffers,enc,ftype);
            fileInfo.then(function(result) {
                //console.log(result) // "Some User token"
                s3info.push(result);
                //console.log(s3info);//this works?
            })
            console.log(s3info);
        })
    })
    busboy.on('error', err => {
        reject(err)
    })
    busboy.on('finish', function() {
        res.send({data:s3info, status: 'success', msg: 'Files successfully uploaded.'});
   });

    req.pipe(busboy) // pipe the request to the form handler
    })
}
*/
