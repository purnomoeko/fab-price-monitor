const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('should');
const { plainRedisConnection } = require('../redis');
const app = require('../app');


describe('Generate right format from the link', () => {
    const scrapper = require('../scrapping');
    it('Should be able to read https from fabelio', async () => {
        const data = await scrapper('https://fabelio.com/ip/ikarus-dining-table-kit.html');
        data.should.be.an.Object();
        data.should.have.property('productId');
        const { redisHgetAll } = plainRedisConnection();
        const dataFromRedis = await redisHgetAll(data.productId);
        Object.keys(dataFromRedis).forEach((key) => {
            const individualKey = JSON.parse(dataFromRedis[key]);
            individualKey.productId.should.be.equal(data.productId);
        });
    }).timeout(5000);

    it('Should be able to send request via http', async () => {
        // Configure chai
        chai.use(chaiHttp);
        chai.should();

        const response = await chai.request(app)
            .post('/product/create')
            .set('Content-Type', 'application/json')
            .send({
                url: 'https://fabelio.com/ip/taby-dining-table.html',
            });
        console.info(response.body);
        response.should.have.status(200);
        response.body.should.have.property('result');
    });
});
