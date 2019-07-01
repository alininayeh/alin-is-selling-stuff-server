const {PORT, AUTH_SECRET_KEY, ADMIN_USER, ADMIN_PASS} = require('./config');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Api = require('./api');
const upload = require('./upload');
const singleUpload = upload.single('image');

class App {
    constructor() {
        this._secretKey = AUTH_SECRET_KEY;
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

    _router() {
        // authentication
        app.post('/api/login', this.login.bind(this));

        // file upload
        app.post('/api/upload', this.uploadImage.bind(this));

        // products
        app.get('/api/products', this.getProducts.bind(this));
        app.post('/api/products', this.addProduct.bind(this));
        app.put('/api/products', this.editProduct.bind(this));
        app.delete('/api/products', this.deleteProduct.bind(this));
    }

    // Authentication
    login(req, res) {
        const user = req.body.user;
        const pass = req.body.pass;

        if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
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

        try {
            singleUpload(req, res, (err) => {
                if (err) {
                    return res.json({error: 'Could not upload image!'});
                }

                res.json({imageUrl: req.file.location});
            });
        } catch(e) {
            res.json({error: 'Could not upload image!'});
        }
    }

    // Products
    async getProducts(req, res) {
        try {
            const products = await Api.getProducts();
            res.json({products});
        } catch(e) {
            res.json({error: 'Could not get products!'});
        }
    }

    async addProduct(req, res) {
        const token = await this._verifyToken(req, res);
        if (!token) return;

        const {name, description, price, image} = req.body;

        if (!name || !description || !price) {
            return res.json({error: 'Not enough data!'});
        }

        const product = {
            name,
            description,
            price,
            sold: false,
            image
        };
        
        try {
            await Api.addProduct(product);
            res.json({product});
        } catch(e) {
            res.json({error: 'Could not add product!'});
        }
    }

    async editProduct(req, res) {
        const token = await this._verifyToken(req, res);
        if (!token) return;

        const {name, description, price, image, id} = req.body;

        if (!name || !description || !price) {
            return res.json({error: 'Not enough data!'});
        }

        const product = {
            name,
            description,
            price,
            image
        };
        
        try {
            await Api.editProduct(id, product);
            res.json({product});
        } catch(e) {
            res.json({error: 'Could not edit product!'});
        }
    }

    async deleteProduct(req, res) {
        const token = await this._verifyToken(req, res);
        if (!token) return;

        const {id} = req.body;

        if (!id) {
            return res.json({error: 'Not enough data!'});
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
