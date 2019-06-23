const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
const Api = require('./api');
const uploadsFolder = '../uploads';

class App {
    constructor() {
        this._secretKey = 'alinissellingstuff1515165177421';
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
    }

    addCORSHeader() {
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Token, Country');
            res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT');
            next();
        });
    }

    uploadFile(file, folder) {
        return new Promise((resolve, reject) => {
            const fileType = file.type.split('/').pop();

            if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {
                let uploadedFileName = `${new Date().getTime()}.${fileType}`;
    
                fs.rename(file.path, `${uploadsFolder}/${folder}/${uploadedFileName}`, (err) => {
                    if (err) throw err;
                    resolve(uploadedFileName);
                });
            } else {
                reject();
            }
        });
    }

    router() {
        // authentication
        app.post('/api/login', this.login.bind(this));

        // products
        app.get('/api/products', this.getProducts.bind(this));
        app.post('/api/products', this.addProduct.bind(this));
        app.delete('/api/products', this.deleteProduct.bind(this));
    }

    start() {
        this.addCORSHeader();
        this.router();
        app.listen(3001);
    }

    // Authentication
    login(req, res) {
        const user = req.body.user;
        const pass = req.body.pass;

        if (user !== 'admin' || pass !== '`~5X(jbwTYreU}xP$$w0') {
            res.json({ error: 'Wrong credentials!' });
        } else {
            jwt.sign({}, this._secretKey, { expiresIn: '24h' }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        }
    }

    verifyToken(req, res) {
        return new Promise(resolve => {
            jwt.verify(req.headers.token, this._secretKey, err => {
                if (err) {
                    res.json({error: 'Could not login!'});
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    // Products
    async getProducts(req, res) {
        const products = await Api.getProducts().catch(() => res.json({error: 'Could not get products!'}));
        res.json({products});
    }

    async addProduct(req, res) {
        const token = await this.verifyToken(req, res);
        if (!token) return;

        const {name, description, price} = req.body;

        if (!name || !description || !price) {
            res.json({error: 'Not enough data!'});
            return;
        }

        const product = {
            name,
            description,
            price,
            sold: false,
            photos: []
        };
        
        await Api.addProduct(product).catch(() => res.json({error: 'Could not add product!'}));
        res.json({product});
    }

    async deleteProduct(req, res) {
        const token = await this.verifyToken(req, res);
        if (!token) return;

        const {id} = req.body;

        if (!id) {
            res.json({error: 'Not enough data!'});
            return;
        }

        await Api.deleteProduct(id);
        res.json({id});
    }
}

const MyApp = new App();
MyApp.start();
