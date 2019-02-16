const { Schema } = require('mongoose');

const comments = Schema({
    comment: String,
    uuid: String,
    productId: {
        type: String,
        required: true,
    },
    upVoteCount: Number,
    downVoteCount: Number,
    upVotes: {
        type: Array,
        default: [],
    },
    downVotes: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
});

comments.pre('save', function (next) {
    this.upVoteCount = this.upVotes.length;
    this.downVoteCount = this.downVotes.length;
    this.updatedAt = Date.now();
    if (!this.createdAt) {
        this.createdAt = Date.now();
    }
    next();
});


module.exports = global.db.model('comments', comments);