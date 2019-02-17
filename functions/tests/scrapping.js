const chai = require('chai');
const chaiHttp = require('chai-http');
const { plainRedisConnection } = require('../redis');
const app = require('../app');
chai.should();

describe('Generate right format from the link', () => {
    const scrapper = require('../scrapping');
    before(() => {
        const mongoose = require('mongoose');
        let mongoUrlConnection = process.env.FAB_MONITORING_URL || 'mongodb://localhost/';
        mongoUrlConnection += process.env.FAB_MONITORING_DBNAME || 'fab-monitoring';
        global.db = mongoose.createConnection(mongoUrlConnection, { useNewUrlParser: true });
    });
    it('Should be able to read https from fabelio', async () => {
        const data = await scrapper('https://fabelio.com/ip/ikarus-dining-table-kit.html');
        data.should.be.an('Object');
        data.should.have.property('productId');
        const modelProduct = require('../model/products');
        const dbData = await modelProduct.findOne({ productId: data.productId });
        dbData.productId.should.be.equal(data.productId);
    }).timeout(5000);

    it('Should be able to send request via http', async () => {
        // Configure chai
        chai.use(chaiHttp);

        const response = await chai.request(app)
            .post('/product/create')
            .set('Content-Type', 'application/json')
            .send({
                url: 'https://fabelio.com/ip/taby-dining-table.html',
            });
        response.should.have.status(200);
        response.body.should.have.property('result');
    });
});
