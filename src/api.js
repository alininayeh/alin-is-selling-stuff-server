const Database = require('./database');

const Api = {
    getProducts() {
        return new Promise(async (resolve, reject) => {
            await Database.connect();
            const products = await Database.getProducts().catch(() => reject());
            resolve(products);
            Database.disconnect();
        });
    },

    addProduct(product) {
        return new Promise(async (resolve, reject) => {
            await Database.connect();
            await Database.addProducts([product]).catch(() => reject());
            resolve();
            Database.disconnect();
        });
    },

    deleteProduct(productId) {
        return new Promise(async (resolve, reject) => {
            await Database.connect();
            await Database.deleteProduct(productId).catch(() => reject());
            resolve();
            Database.disconnect();
        });
    }
};

module.exports = Api;