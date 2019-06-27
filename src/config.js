if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}

const {
    PORT,
    MONGODB_URI,
    MONGODB_NAME,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
    S3_BUCKET_NAME,
    S3_BUCKET_REGION,
    AUTH_SECRET_KEY,
    ADMIN_USER,
    ADMIN_PASS
} = process.env;

module.exports = {
    PORT,
    MONGODB_URI,
    MONGODB_NAME,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
    S3_BUCKET_NAME,
    S3_BUCKET_REGION,
    AUTH_SECRET_KEY,
    ADMIN_USER,
    ADMIN_PASS
};