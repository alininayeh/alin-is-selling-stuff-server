const database = require('./src/database');

database.connectToDatabase().then(
    data => {
        console.log('Database created');
        const {db, dbName} = data;
        const myDb = db.db(dbName);
        
        myDb.createCollection('products', err => {
            if (err) throw err;
            console.log('Collection created');
    
            // check for existing items
            myDb.collection('products').find({}).toArray((err, result) => {
                if (err) throw err;
                if (!result.length) {
                    myDb.collection('products').insertMany([
                        {id: 1, name: 'Item 1', description: 'item 1 description', photos: [], price: 100, sold: false},
                        {id: 2, name: 'Item 2', description: 'item 2 description', photos: [], price: 100, sold: false},
                        {id: 3, name: 'Item 3', description: 'item 3 description', photos: [], price: 100, sold: false}
                    ], (err, res) => {
                        if (err) throw err;
                        console.log('Sample products added');
                        db.close();
                    });
                } else {
                    db.close();
                }            
            });
        });
    },
    err => {
        throw err;
    }
);