const {PORT} = require('./config');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
const Api = require('./api');
const path = require('path');

class App {
    constructor() {
        this._secretKey = 'alinissellingstuff1515165177421';
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
    }

    _addCORSHeader() {
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Token, Country');
            res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT');
            next();
        });
    }

    _verifyToken(req, res) {
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

    _uploadFile(file) {
        return new Promise((resolve, reject) => {
            const uploadsFolder = path.join(__dirname, '../uploads');
            const fileType = file.type.split('/').pop();

            if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {
                let uploadedFileName = `${new Date().getTime()}.${fileType}`;
    
                fs.rename(file.path, `${uploadsFolder}/${uploadedFileName}`, (err) => {
                    if (err) reject(err);
                    resolve(uploadedFileName);
                });
            } else {
                reject();
            }
        });
    }

    _router() {
        // authentication
        app.post('/api/login', this.login.bind(this));

        // file upload
        app.post('/api/upload', this.uploadImage.bind(this));

        // products
        app.get('/api/products', this.getProducts.bind(this));
        app.post('/api/products', this.addProduct.bind(this));
        app.delete('/api/products', this.deleteProduct.bind(this));
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

    // File upload
    async uploadImage(req, res) {
        const token = await this._verifyToken(req, res);
        if (!token) return;

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.json({error: 'Could not process data!'});
                return;
            }

            const {image} = files;

            if (image && image.name) {
                try {
                    const filename = await this._uploadFile(image);
                    res.json({url: filename});
                } catch(e) {
                    console.log(e);
                    res.json({error: 'Could not upload image!'});
                    return;
                }
            }
        });
    }

    // Products
    async getProducts(req, res) {
        try {
            const products = await Api.getProducts();
            res.json({products});
        } catch(e) {
            res.json({error: 'Could not get products!'});
            return;
        }
    }

    async addProduct(req, res) {
        const token = await this._verifyToken(req, res);
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
        
        try {
            await Api.addProduct(product);
            res.json({product});
        } catch(e) {
            res.json({error: 'Could not add product!'});
        }
    }

    async deleteProduct(req, res) {
        const token = await this._verifyToken(req, res);
        if (!token) return;

        const {id} = req.body;

        if (!id) {
            res.json({error: 'Not enough data!'});
            return;
        }

        await Api.deleteProduct(id);
        res.json({id});
    }

    start() {
        this._addCORSHeader();
        this._router();
        app.listen(PORT);
    }
}

module.exports = new App();