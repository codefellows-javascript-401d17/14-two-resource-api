'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Band = require('../model/band.js');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

mongoose.Promise = Promise;
require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleBand = {
  name: 'test band name',
  origin: 'test band origin'
};

describe('Band Routes', function() {
  describe('POST: /api/band', function() {
    describe('with a valid req body', function() {
      after( done => {
        if(this.tempBand) {
          Band.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a band', done => {
        request.post(`${url}/api/band`)
        .send(exampleBand)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test band name');
          expect(res.body.origin).to.equal('test band origin');
          this.tempBand = res.body;
          done();
        });
      });

      it('should return 400 bad request', done => {
        request.post(`${url}/api/band`)
        .send({ name: 'fake band', genre: 'indie'})
        .end((err, res) => {
          console.log('res text:', res.text);
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });
    });
  });

  describe('GET: /api/band/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Band(exampleBand).save()
        .then( band => {
          this.tempBand = band;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempBand) {
          Band.remove({})
          .then( () => done())
          .catch(done);
        }
      });

      it('should return a band', done => {
        request.get(`${url}/api/band/${this.tempBand._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test band name');
          expect(res.body.origin).to.equal('test band origin');
          done();
        });
      });

      it('should return 404 not found', done => {
        request.get(`${url}/api/band/12345`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('PUT: /api/band', function() {
    before(done => {
      Band.create(exampleBand)
      .then(band => {
        this.testBand = band;
        done();
      })
      .catch(err => done(err));
    });

    after(done => {
      Band.remove({})
      .then( () => done())
      .catch(err => done(err));
    });

    it('should return a band', done => {
      request.put(`${url}/api/band/${this.testBand._id}`)
      .send({ name: 'new name', origin: 'new origin'})
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('new name');
        expect(res.body.origin).to.equal('new origin');
        done();
      });
    });

    it('should return 400 bad request', done => {
      request.put(`${url}/api/band/${this.testBand._id}`)
      .end((err, res) => {
        console.log('res text:', res.text);
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('BadRequestError');
        done();
      });
    });

    it('should return 404 not found', done => {
      request.put(`${url}/api/band/12235235`)
      .send({ name: 'new name', origin: 'new origin'})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('NotFoundError');
        done();
      });
    });
  });
});
