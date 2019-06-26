const {MongoClient, ObjectID} = require('mongodb');
const dbPath = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_NAME || 'alin-is-selling-stuff';

const Database = {
    connect() {
        console.log('database', dbPath, dbName);
        
        return new Promise((resolve, reject) => {
            MongoClient.connect(dbPath, {useNewUrlParser: true}, (err, client) => {
                if (err) reject(err);
                this.client = client;
                this.db = client.db(dbName);
                resolve();
            });
        });
    },

    createCollection(collectionName) {
        return new Promise((resolve, reject) => {
            this.db.createCollection(collectionName, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    },

    getProducts(filter = {}) {
        return new Promise((resolve, reject) => {
            this.db.collection('products').find(filter).toArray((err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    },

    addProducts(products) {
        return new Promise((resolve, reject) => {
            this.db.collection('products').insertMany(products, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    },

    deleteProduct(productId) {
        return new Promise((resolve, reject) => {
            this.db.collection('products').deleteOne({
                _id: new ObjectID(productId)
            }, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    },

    disconnect() {
        this.client.close();
    }
};

module.exports = Database;