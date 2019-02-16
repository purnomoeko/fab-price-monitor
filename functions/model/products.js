const { Schema } = require('mongoose');

const products = Schema({
    title: {
        type: String,
        set: function (title) {
            this._title = this.title;
            return title;
        },
    },
    link: String,
    price: {
        type: Number,
        // This method holds the magic
        set: function (price) {
            this._price = this.price;
            return price;
        },
    },
    productId: {
        type: String,
        required: true,
        uniquer: true,
    },
    images: Object,
    productsHistory: {
        type: Array,
    },
    updatedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
    },
});
products.index('productId');

products.pre('save', function (next) {
    this.updatedAt = Date.now();
    if (!this.createdAt) {
        this.createdAt = Date.now();
    }
    next();
});

module.exports = global.db.model('products', products);