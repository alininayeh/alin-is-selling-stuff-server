const {MONGODB_URI, MONGODB_NAME} = require('./config');
const {MongoClient, ObjectID} = require('mongodb');

const Database = {
    connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MONGODB_URI, {useNewUrlParser: true}, (err, client) => {
                if (err) reject(err);
                this.client = client;
                this.db = client.db(MONGODB_NAME);
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

    editProduct(productId, product) {
        return new Promise((resolve, reject) => {
            this.db.collection('products').updateOne(
                {
                    _id: new ObjectID(productId)
                },
                {
                    $set: product
                }, (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
            }
        );
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