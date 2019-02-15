const rp = require('request-promise');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const { plainRedisConnection } = require('./redis');

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
            
            const articleData = {
                title,
                price,
                productId,
                images: JSON.parse(images),
            };
            const { redisHset, redisExpire } = plainRedisConnection();
            redisHset(productId, new Date().getTime(), JSON.stringify(articleData));
            redisExpire(productId, 3600 * 24 * 2); // 2 Days Expiration
            return articleData;
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
