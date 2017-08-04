const expect = require('chai').expect;
const request = require('superagent');
const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`;
const Airport = require('../model/airport.js');


require('../server.js');
var exampleAirportBody = { name: 'testport' };

describe('Airport Router', function () {
  describe('POST /api/airport', function () {
    after((done) => {
      if (this.tempAirport) {
        Airport.remove({})
          .then(() => done())
          .catch(done);
        return;
      }
      done();
    });
    it('saves airport document to collection', (done) => {
      request.post(`${url}/api/airport`)
        .send(exampleAirportBody)
        .end((err, rsp) => {
          if (err) return done(err);
          expect(rsp.status).to.equal(200);
          this.tempAirport = rsp.body;
          done();
        });
    });
    it('returns 400 error if no request body', (done) => {
      request.post(`${url}/api/airport`)
        .end((err, rsp) => {
          expect(rsp.status).to.equal(400);
          done();
        });
    });
  });
  describe('GET /api/airport', function () {
    describe('given a valid body', function () {
      before((done) => {
        new Airport(exampleAirportBody).save()
          .then((airport) => {
            this.tempAirport = airport;
            done();
          })
          .catch(done);
      })
      it('returns an airport response', (done) => {
        request.get(`${url}/api/airport/${this.tempAirport._id}`)
          .end((err, rsp) => {
            if (err) return done(err);
            expect(rsp.status).to.equal(200);
            expect(rsp.body.name).to.equal('testport');
            done();
          })
      })
    })
    describe('given an invalid request id', function () {
      it('returns an airport response', (done) => {
        request.get(`${url}/api/airport/12345`)
          .end((err, rsp) => {
            expect(rsp.status).to.equal(404);
            done();
          })
      })
    })
  })
  describe('PUT /api/airport/:id', function () {
    describe('when provided a proper id', function () {
      before((done) => {
        new Airport(exampleAirportBody).save()
          .then((airport) => {
            this.tempAirport = airport;
            done();
          })
          .catch(done)
      })
      after((done) => {
        Airport.remove({})
          .then(() => {
            done()
          })
          .catch(done);
      })
      it('should respond with an airport', (done) => {
        let updateBody = { name: 'coolnewairport' };
        request.put(`${url}/api/airport/${this.tempAirport._id}`)
          .send(updateBody)
          .end((err, rsp) => {
            if (err) return done(err);
            expect(rsp.status).to.equal(200);
            done();
          })
      })
      it('should return 400 without request body', (done) => {
        request.put(`${url}/api/airport/${this.tempAirport._id}`)
          .end((err, rsp) => {
            expect(rsp.status).to.equal(400);
            done();
          })
      })
      it('should return 404 with valid request but bad id', (done) => {
        let updateBody = { name: 'coolnewairport' };
        request.put(`${url}/api/airport/12345`)
          .send(updateBody)
          .end((err, rsp) => {
            expect(rsp.status).to.equal(404);
            done();
          })
      })
    })
  })
});