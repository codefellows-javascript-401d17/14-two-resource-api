'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const House = require('../model/house.js');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

mongoose.Promise = Promise;
require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleHouse = {
  familyName: 'Atreides',
  seat: 'Arrakeen',
  region: 'Arrakis',
  words: 'Fear is the Mind-Killer'
};

const exampleChar = {
  name: 'Paul'
};

describe('House Routes', function() {
  describe('POST: /api/house', function() {
    describe('with a valid req body', function() {
      after(done => {
        if(this.tempHouse) {
          House.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a house', done => {
        request.post(`${url}/api/house`)
        .send(exampleHouse)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.familyName).to.equal('Atreides');
          this.tempHouse = res.body;
          done();
        });
      });
    });
  });

  describe('GET: /api/house/:id', function() {
    describe('with a valid body', function() {
      before(done => {
        new House(exampleHouse).save()
        .then(house => {
          this.tempHouse = house;
          return House.findByIdAndAddChar(house._id, exampleChar);
        })
        .then(char => {
          this.tempChar = char;
          done();
        })
        .catch(done);
      });

      after(done => {
        if(this.tempHouse) {
          House.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a house', done => {
        request.get(`${url}/api/house/${this.tempHouse._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.familyName).to.equal('Atreides');
          expect(res.body.characters.length).to.equal(1);
          expect(res.body.characters[0].name).to.equal(exampleChar.name);
          done();
        });
      });
    });
  });

  describe('PUT: /api/house/:id', function() {
    describe('with a valid body', function() {
      before(done => {
        new House(exampleHouse).save()
        .then(house => {
          this.tempHouse = house;
          done();
        })
        .catch(done);
      });

      after(done => {
        if(this.tempHouse) {
          House.remove({})
          .then(() => done())
          .catch(done);
        }
      });

      it('should return a house', done => {
        var updated = { familyName: 'Harkonnen' };

        request.put(`${url}/api/house/${this.tempHouse._id}`)
        .send(updated)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.familyName).to.equal(updated.familyName);
          done();
        });
      });
    });
  });
});
