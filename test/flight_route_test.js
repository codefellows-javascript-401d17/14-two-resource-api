const expect = require('chai').expect;
const request = require('superagent');
const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`;
const Airport = require('../model/airport.js');
const Flight = require('../model/flight.js');
const debug = require('debug')('flight:flight_route_test.js')

require('../server.js');
const exampleAirportBody = { name: 'Fort Worth Intl Airport' };
const exampleFlightBody = { destination: 'Bahamas', flightNumber: '12345' };

describe('Flight Router', function () {
  describe('POST /api/airport/:airportID/flight', function () {
    describe('with a valid airportID and flightBody', function () {
      before((done) => {
        Airport.create(exampleAirportBody)
          .then((airport) => {
            this.tempAirport = airport;
            done();
          })
          .catch(done);
      })
      after((done) => {
        Promise.all([
          Airport.remove({}),
          Flight.remove({})
        ])
          .then(() => done())
          .catch(done);
      })
      it('should respond with a flight', (done) => {
        request.post(`${url}/api/airport/${this.tempAirport._id}/flight`)
          .send(exampleFlightBody)
          .end((err, rsp) => {
            if (err) console.log(err);
            expect(rsp.status).to.equal(200);
            expect(rsp.body.destination).to.equal(exampleFlightBody.destination);
            expect(rsp.body.airportID).to.equal(this.tempAirport._id.toString());
            done();
          })
      })
    })
  })
})