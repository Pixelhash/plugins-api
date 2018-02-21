const chai = require('chai');
const exspect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../server'); // Our app

describe('API endpoint /plugins', function() {
    this.timeout(2500); // How long to wait for a response (ms)

    before(function() {
        
    });

    after(function() {

    });

    // GET - Invalid path
    it('should return 404 Not Found', function() {
        return chai.request(app)
            .get('/r2d2')
            .then(function(res) {
                throw new Error('Path exists!');
            })
            .catch(function(err) {
                exspect(err).to.have.status(404);
            });
    });

    // GET - List all plugins
    it('should return all plugins', function() {
        return chai.request(app)
            .get('/plugins')
            .then(function(res) {
                exspect(res).to.have.status(200);
                exspect(res).to.be.json;
                exspect(res.body).to.be.an('array');
            });
    });


});