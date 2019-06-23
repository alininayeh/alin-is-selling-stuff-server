const express = require('express');
const app = express();
const database = require('./database');

function getProducts(req, res) {
    database.connectToDatabase().then(
        data => {
            const {db, dbName} = data;
            const myDb = db.db(dbName);

            myDb.collection('products').find({}).toArray((err, result) => {
                if (err) throw err;
                res.json({
                    products: result
                });
            });
        },
        err => {
            throw err;
        }
    );
}

// get products
app.get('/api/products', getProducts);
app.listen(3001);