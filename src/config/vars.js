const path = require('path');

require('dotenv-safe').config({
    path: path.join(__dirname, '../../.env'),
    example: path.join(__dirname, '../../.env.example'),
});

module.exports = {
    baseurl : process.env.NODE_ENV == 'development' ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL,
    env : process.env.NODE_ENV,
    port : process.env.PORT,
    mongo : {
        uri : process.env.NODE_ENV == 'development' ? process.env.MONGOOSE_DEVELOPMENT_URL : process.env.MONGOOSE_PRODUCTION_URL,
    },
    file: {
        upload_image_size: process.env.IMAGE_UPLOAD_SIZE,
        default_image: process.env.DEFAULT_IMAGE_URL
    },
    aws: {
        bucket_name: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_BUCKET_REGION,
        access_key: process.env.AWS_ACCESS_KEY,
        secret_key: process.env.AWS_SECRET_KEY,
    },
}