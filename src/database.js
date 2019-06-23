const MongoClient = require('mongodb').MongoClient;
const dbName = 'alin-is-selling-stuff';
const url = 'mongodb://localhost:27017/' + dbName;

const connectToDatabase = () => (
    new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
            if (err) reject(err);
            resolve({
                db,
                dbName
            });
        });
    })
);

module.exports = {
    connectToDatabase
};