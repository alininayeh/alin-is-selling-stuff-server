const {S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME, S3_BUCKET_REGION} = require('./config');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');

aws.config.update({
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
    region: S3_BUCKET_REGION
});

const s3 = new aws.S3();

const upload = multer({
    fileFilter: function (req, file, cb) {
        if(['.jpg', '.jpeg', '.png'].indexOf(path.extname(file.originalname).toLowerCase()) === -1) {
            cb(new Error('Only images allowed'));
        } else {
            cb(null, true);
        }
        
    },
    storage: multerS3({
        s3,
        bucket: S3_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, {...req.body});
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + file.originalname);
        }
    })
});

module.exports = upload;

