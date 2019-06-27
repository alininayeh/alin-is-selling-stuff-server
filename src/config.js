const dotenv = require('dotenv');
dotenv.config();

const {PORT, MONGODB_URI, MONGODB_NAME} = process.env;
module.exports = {PORT, MONGODB_URI, MONGODB_NAME};