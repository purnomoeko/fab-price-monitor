const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const uuid = require('uuid');
const faker = require('faker');
const app = require('../app');


chai.use(chaiHttp);
chai.should();

describe('List the product', () => {
    const uuidUpvotes = uuid();
    const uuidDownvotes = uuid();
    before(() => {
        let mongoUrlConnection = process.env.FAB_MONITORING_URL || 'mongodb://localhost/';
        mongoUrlConnection += process.env.FAB_MONITORING_DBNAME || 'fab-monitoring';
        global.db = mongoose.createConnection(mongoUrlConnection, { useNewUrlParser: true });
    });
    it('Should be able to listing products that has been saved', async () => {
        // Configure chai
        

        const response = await chai.request(app)
            .get('/product')
            .set('Content-Type', 'application/json');
        response.should.have.status(200);
        response.body.should.have.property('records');
        response.body.should.have.property('cursor');
        response.body.records.should.be.an('Array');
    });
    it('Should be able to get one record based on objectId', async () => {
        const Product = require('../model/products');
        const product = await Product.findOne({ });
        const response = await chai.request(app)
            .get(`/product/one/${product._id}`)
            .set('Content-Type', 'application/json');
        response.should.have.status(200);
        response.body.should.have.property('product');
    });

    it('Should be able to create comment', async () => {
        const Product = require('../model/products');
        const product = await Product.findOne({});
        const response = await chai.request(app)
            .post(`/product/${product._id}/comments`)
            .set('Content-Type', 'application/json')
            .send({
                uuid: uuid(),
                comment: faker.lorem.sentences(),
            });
        response.should.have.status(200);
        response.body.should.have.property('comment');
    });

    it('Should be able to list comments', async () => {
        const Product = require('../model/products');
        const product = await Product.findOne({});
        const response = await chai.request(app)
            .get(`/product/${product.id}/comments`)
            .set('Content-Type', 'application/json');
        response.should.have.status(200);
        response.body.should.have.property('records');
        response.body.records.should.be.an('Array');
    });

    it('Should be able to send upvotes', async () => {
        const Comment = require('../model/comments');
        const comments = await Comment.findOne({ });

        const response = await chai.request(app)
            .post(`/product/comments/${comments.id}/votes`)
            .set('Content-Type', 'application/json')
            .send({
                type: 'upvote',
                uuid: uuidUpvotes,
            });
        response.should.have.status(200);
        response.body.should.have.property('comment');
        response.body.comment.should.be.an('object');
    });
    it('Should be able to send downvotes with current id', (done) => {
        setTimeout(async () => {
            const Comment = require('../model/comments');
            const comments = await Comment.findOne({});
            const response = await chai.request(app)
                .post(`/product/comments/${comments.id}/votes`)
                .set('Content-Type', 'application/json')
                .send({
                    type: 'downvote',
                    uuid: uuidUpvotes,
                });
            response.should.have.status(200);
            response.body.should.have.property('comment');
            response.body.comment.should.be.an('object');
            done();
        }, 1000);
    });
    it('Should be able to send downvotes', async () => {
        const Comment = require('../model/comments');
        const comments = await Comment.findOne({});

        const response = await chai.request(app)
            .post(`/product/comments/${comments.id}/votes`)
            .set('Content-Type', 'application/json')
            .send({
                type: 'downvote',
                uuid: uuidDownvotes,
            });
        response.should.have.status(200);
        response.body.should.have.property('comment');
        response.body.comment.should.be.an('object');
    });
    it('Should be able to send upvotes with currentId', async () => {
        const Comment = require('../model/comments');
        const comments = await Comment.findOne({});

        const response = await chai.request(app)
            .post(`/product/comments/${comments.id}/votes`)
            .set('Content-Type', 'application/json')
            .send({
                type: 'upvote',
                uuid: uuidDownvotes,
            });
        response.should.have.status(200);
        response.body.should.have.property('comment');
        response.body.comment.should.be.an('object');
    });

    after(() => {
        global.db.close();
    });
});
