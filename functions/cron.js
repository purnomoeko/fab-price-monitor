const mongoose = require('mongoose');
const scrapping = require('./scrapping');

(async () => {
    let mongoUrlConnection = process.env.FAB_MONITORING_URL || 'mongodb://localhost/';
    mongoUrlConnection += process.env.FAB_MONITORING_DBNAME || 'fab-monitoring';
    global.db = mongoose.createConnection(mongoUrlConnection, { useNewUrlParser: true });

    const Product = require('./model/products');
    const products = await Product.find({ }).limit(100);
    const requests = products.map(product => scrapping(product.link))
    return Promise.all(requests);
})().then((result) => {
    console.info(result);
    process.exit();
}).catch((error) => {
    console.error(error);
    // process.exit();
});
