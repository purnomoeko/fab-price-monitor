const express = require('express');
const { body, validationResult, query, param } = require('express-validator/check');
const { Types } = require('mongoose');
const router = express.Router();
const scrapping = require('../scrapping');

/* GET home page. */
router.post('/create', [
    body('url').isURL().withMessage('INVALID_URL'),
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: errors.array() });
    }
    try {
        const result = await scrapping(req.body.url);
        res.status(200).send({ status: 200, message: 'PRODUCT_WATCHED', result });
    } catch (error) {
        res.status(500).send({ status: 500, message: 'ERROR', error });
    }
});

router.get('/', [
    query('skip').optional().isNumeric().withMessage('INVALID_SKIP_NUMBER'),
],
async (req, res) => {
    try {
        const Products = require('../model/products');
        const productList = await Products.find({ }, null, { skip: req.query.skip || 0 }).limit(10);
        res.status(200).send({ status: 200, records: productList, cursor: (req.query.skip || 0) + 10 });
    } catch (error) {
        res.status(500).send({ status: 500, message: 'ERROR_OCCURED', errorMessage: error.message });
    }
});

router.get('/one/:objectId', async (req, res) => {
    try {
        const Products = require('../model/products');
        const product = await Products.findOne({ _id: new Types.ObjectId(req.params.objectId) });
        res.status(200).send({ status: 200, product });
    } catch (error) {
        res.status(500).send({ status: 500, message: 'ERROR_OCCURED', errorMessage: error.message });
    }
});

router.post('/:objectId/comments', [
    body('uuid').isUUID().withMessage('UUID_REQUIRED'),
    body('comment').isString().withMessage('COMMENT_REQUIRED'),
    param('objectId').isAlphanumeric().withMessage('OBJECTID_MALFORMED'),
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: errors.array() });
    }
    try {
        const Comments = require('../model/comments');
        const comment = new Comments({
            comment: req.body.comment,
            uuid: req.body.uuid,
            productId: req.params.objectId,
        });
        await comment.save();
        res.status(200).send({ status: 200, message: 'COMMENT_SAVED', comment });
    } catch (error) {
        res.status(500).send({ status: 500, message: 'ERROR_OCCURED', errorMessage: error.message });
    }
});

router.get('/:objectId/comments', [
    param('objectId').isAlphanumeric().withMessage('OBJECTID_MALFORMED'),
],
async (req, res) => {
    try {
        const Comments = require('../model/comments');
        const records = await Comments.find({ productId: new Types.ObjectId(req.params.objectId) });
        res.status(200).send({ status: 200, records });
    } catch (error) {
        res.status(500).send({ status: 500, message: 'ERROR_OCCURED', errorMessage: error.message });
    }
});

router.post('/comments/:commentId/votes', [
    body('uuid').isUUID().withMessage('UUID_REQUIRED'),
    param('commentId').isAlphanumeric().withMessage('OBJECTID_MALFORMED'),
    body('type').isIn(['upvote', 'downvote']).withMessage('INVALID_TYPE'),
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ status: 400, message: errors.array() });
        return;
    }
    try {
        const Comments = require('../model/comments');
        const comment = await Comments.findOne({ _id: Types.ObjectId(req.params.commentId) });
        if (comment === null) {
            throw new Error('COMMENT_NOT_FOUND');
        }
        const upVotesIndex = comment.upVotes.indexOf(req.body.uuid);
        const downVotesIndex = comment.downVotes.indexOf(req.body.uuid);
        let message = null;
        
        if (req.body.type === 'upvote') {
            if (upVotesIndex > -1) message = 'YOU_HAVE_UPVOTED_THE_COMMENT';
            else {
                if (downVotesIndex > -1) comment.downVotes.splice(downVotesIndex, 1);
                comment.upVotes.push(req.body.uuid);
            }
        } else if (req.body.type === 'downvote') {
            if (downVotesIndex > -1) message = 'YOU_HAVE_DOWNVOTED_THE_COMMENT';
            else {
                if (upVotesIndex > -1) comment.upVotes.splice(upVotesIndex, 1);
                comment.downVotes.push(req.body.uuid);
            }
        }
        await comment.save();
        if(message === null) message = 'VOTES_CREATED';
        res.status(200).send({ status: 200, message, comment });
    } catch (error) {
        console.info(error.message);
        res.status(500).send({ status: 500, message: 'ERROR_OCCURED', errorMessage: error.message });
    }
});

module.exports = router;
