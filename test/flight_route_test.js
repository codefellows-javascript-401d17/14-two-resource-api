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
            if (err) done(err);
            expect(rsp.status).to.equal(200);
            expect(rsp.body.destination).to.equal(exampleFlightBody.destination);
            expect(rsp.body.airportID).to.equal(this.tempAirport._id.toString());
            done();
          })
      })
    })
  })
  describe('GET /api/airport/:airportID/flight/', function () {
    describe('when provided a valid flight id', function () {
      before((done) => {
        Airport.create(exampleAirportBody)
          .then((airport) => {
            this.tempAirport = airport;
            Airport.findByIdAndAdd(this.tempAirport._id, exampleFlightBody);
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      after((done) => {
        Promise.all([
          Airport.remove({}),
          Flight.remove({})
        ])
          .then(() => done())
          .catch(done);
      })
      it('responds with a note', (done) => {
        request.get(`${url}/api/airport/${this.tempAirport._id}`)
          .send(exampleFlightBody)
          .end((err, rsp) => {
            if (err) done(err);
            expect(rsp.status).to.equal(200);
            done();
          })
      })
    })
  })
  describe('PUT /api/airport/:airportID/flight/:flightID', function () {
    describe('provided proper airportID, flightID, and flightBody', function () {
      before((done) => {
        Airport.create(exampleAirportBody)
          .then((airport) => {
            this.tempAirport = airport;

            return Airport.findByIdAndAdd(this.tempAirport._id, exampleFlightBody);
          })
          .then((flight) => {
            this.tempFlight = flight;
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      after((done) => {
        Promise.all([
          Airport.remove({}),
          Flight.remove({})
        ])
          .then(() => {
            done();
          })
          .catch(done);
      })
      it('responds with updated flight', (done) => {
        const updateFlightBody = { destination: 'Khazakhstan', flightNumber: '12346423' };
        request.put(`${url}/api/airport/${this.tempAirport._id}/flight/${this.tempFlight._id}`)
          .send(updateFlightBody)
          .end((err, rsp) => {
            if (err) done(err);
            expect(rsp.status).to.equal(200);
            done();
          })
      })
    })
  })
  describe('DELETE /api/airport/:airportID/flight/:flightID', function () {
    describe('when provided with id', function () {
      before((done) => {
        Airport.create(exampleAirportBody)
          .then((airport) => {
            this.tempAirport = airport;

            return Airport.findByIdAndAdd(this.tempAirport._id, exampleFlightBody);
          })
          .then((flight) => {
            this.tempFlight = flight;
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      it('deletes the flight document', (done) => {
        request.delete(`${url}/api/airport/${this.tempAirport._id}/flight/${this.tempFlight._id}`)
          .end((err, rsp) => {
            if (err) done(err);
            expect(rsp.status).to.equal(204);
            done()
          })
      })
    })
  })
})