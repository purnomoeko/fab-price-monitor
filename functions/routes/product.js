const express = require('express');
const { body, validationResult } = require('express-validator/check');

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

module.exports = router;
