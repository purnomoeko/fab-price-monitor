const rp = require('request-promise');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');


const download = (uri, filename, callback) => {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
        callback(res.headers);
        });
    });
};

const sendToDb = (options) => {
    return rp(options)
        .then(async ($) => {
            const title = $('.page-title>span').html();
            const price = $('.price').html();
            const productId = $('#productId').val();
            const images = await rp({
                uri: `https://fabelio.com/swatches/ajax/media/?product_id=${productId}&attributes%5B`
            });
           
            const ModelProducts = require('./model/products');
            const productData = {
                title,
                link: options.uri,
                price: parseInt(price.replace(/\D/g, ''), 10),
                productId,
                images: JSON.parse(images),
                productsHistory: [],
                $setOnInsert: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                $setOnUpdate: {
                    updatedAt: new Date(),
                },
            };
            let currentData = await ModelProducts.findOne({ productId: productData.productId });
            if (currentData === null || currentData === undefined) currentData = new ModelProducts(productData);
            else {
                productData.productsHistory = currentData.productsHistory;
                productData.productsHistory.push({
                    title: currentData.title,
                    price: currentData.price,
                    productId: currentData.productId,
                    updatedAt: currentData.updatedAt,
                });
                // delete productData.productHistory;
                currentData = Object.assign(currentData, productData);
            }
            await currentData.save();
            return productData;
        })
        .catch((err) => {
            console.log(err);
        });
};


module.exports = uri => (
    sendToDb({
        uri,
        transform: (body) => {
            return cheerio.load(body);
        },
    })
);
