const Database = require('./src/database');

async function initDatabase() {
    console.log('Creating a new database if not present', process.env.MONGODB_URI, process.env.MONGODB_NAME);
    await Database.connect();

    console.log('Creating the products collection');
    await Database.createCollection('products').catch(e => console.log(e));

    console.log('Adding sample items');
    const products = await Database.getProducts();

    if (!products.length) {
        await Database.addProducts([
            {id: 1, name: 'Item 1', description: 'item 1 description', photos: [], price: 100, sold: false},
            {id: 2, name: 'Item 2', description: 'item 2 description', photos: [], price: 100, sold: false},
            {id: 3, name: 'Item 3', description: 'item 3 description', photos: [], price: 100, sold: false}
        ]);
    }

    console.log('Done');
    Database.disconnect();
}

initDatabase();