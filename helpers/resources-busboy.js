const AWS = require('aws-sdk');
const Busboy = require('busboy');
AWS.config.update({ accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_ACCESS_SECRET });
const S3 = new AWS.S3();

/**
 * route where we get multipart form data
 * capture file and upload files to s3
 * 
 */
module.exports=async(req,res,next) => {
    let chunks = [], fname, ftype, fEncoding;
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
    req.pipe(busboy);
}