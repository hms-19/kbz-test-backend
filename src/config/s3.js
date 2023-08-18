const AWS = require('aws-sdk')
const { aws } = require('./vars')
const fs = require('fs')

const s3 = new AWS.S3({
    region: aws.region,
    accessKeyId: aws.access_key,
    secretAccessKey: aws.secret_key
})

exports.uploadFileToS3 = (file,fileName) => {

    const binaryImageData = Buffer.from(file, 'base64');

    const uploadParams = {
        Bucket: aws.bucket_name,
        Body: binaryImageData,
        Key: fileName
    }

    return s3.upload(uploadParams).promise()
}

exports.getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: aws.bucket_name
    }

    return s3.getObject(downloadParams).createReadStream()
}

exports.deleteFileFromS3 = (fileKey) => {
    const params = {
        Bucket: aws.bucket_name,
        Key: fileKey,
    };
    
    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.error('Error deleting the file:', err);
        } else {
            console.log('File deleted successfully:', data);
        }
    });
}