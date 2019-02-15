const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');


describe('List the product', () => {

    it('Should be able to send request via http', async () => {
        // Configure chai
        chai.use(chaiHttp);
        chai.should();

        const response = await chai.request(app)
            .get('/product')
            .set('Content-Type', 'application/json');
        response.should.have.status(200);
        response.body.should.have.property('records');
        console.info(response.body.records);
    });
});
