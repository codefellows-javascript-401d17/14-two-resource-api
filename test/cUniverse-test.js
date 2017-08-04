'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const CUniverse = require('../model/cUniverse.js');
const Superhero = require('../model/superhero.js');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

mongoose.Promise = Promise;
require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleCUniverse = {
  name: 'test cUniverse name',
  timestamp: new Date()
};

const exampleSuperhero = {
  name: 'example superhero name',
  powers: 'example powers'
};

describe('CUniverse Routes', function() {
  describe('POST: /api/cUniverse', function() {
    describe('with a valid req body', function() {
      after( done => {
        if (this.tempCUniverse) {
          CUniverse.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a cUniverse', done => {
        request.post(`${url}/api/cUniverse`)
        .send(exampleCUniverse)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test cUniverse name');
          this.tempCUniverse = res.body;
          done();
        });
      });
    });
  });

  describe('GET: /api/cUniverse/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new CUniverse(exampleCUniverse).save()
        .then( cUniverse => {
          this.tempCUniverse = cUniverse;
          return CUniverse.findByIdAndAddSuperhero(cUniverse._id, exampleSuperhero);
        })
        .then( superhero => {
          this.tempSuperhero = superhero;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempCUniverse) {
          CUniverse.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a cUniverse', done => {
        request.get(`${url}/api/cUniverse/${this.tempCUniverse._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test cUniverse name');
          expect(res.body.superheroes.length).to.equal(1);
          expect(res.body.superheroes[0].name).to.equal(exampleSuperhero.name);
          done();
        });
      });
    });
  });

  describe('PUT: /api/cUniverse/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new CUniverse(exampleCUniverse).save()
        .then( cUniverse => {
          this.tempCUniverse = cUniverse;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempCUniverse) {
          CUniverse.remove({})
          .then( () => done())
          .catch(done);
        }
      });

      it('should return an updated cUniverse', done => {
        var updated = { name: 'updated name' };

        request.put(`${url}/api/cUniverse/${this.tempCUniverse._id}`)
        .send(updated)
        .end((err, res) => {
          if (err) return done(err);
          let timestamp = new Date(res.body.timestamp);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(updated.name);
          expect(timestamp.toString()).to.equal(exampleCUniverse.timestamp.toString());
          done();
        });
      });
    });
  });
});
