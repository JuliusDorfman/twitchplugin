// require('dotenv').config();
// const fs = require('fs')
// const S3 = require('aws-sdk/clients/s3');
// const path = require('path');

// const s3 = new S3({
//     region: process.env.AWS_BUCKET_NAME,
//     accessKey: process.env.AWS_ACCESS_KEY,
//     secretKey: process.env.AWS_SECRET_KEY
// })



// // Uploads a file to S3
// function uploadFile(file) {
//     console.log("UPLOAD S3: ", file);
//     // const fileStream = fs.createReadStream(file.path);
//     let imagePath = path.join(__dirname + '/stable-diffusion/' + file);
//     console.log("imagePage: ", imagePath)
//     const uploadParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         image: imagePath,
//         Key: file.filename
//     }
//     console.log("UPLOAD PARAMS: ", uploadParams);

//     return s3.upload(uploadParams).promise();
// }

// exports.uploadFile = uploadFile;

// // Downloads a file from S3