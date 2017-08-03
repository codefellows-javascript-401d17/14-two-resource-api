'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const House = require('../model/house.js');
const Char = require('../model/char.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleChar = {
  name: 'Anakin',
};

const exampleHouse = {
  familyName: 'Skywalker',
  seat: 'Tatooine',
  region: 'Outer Rim',
  words: 'We Do Not Like Sand'
};

describe('Character Routes', function() {
  describe('POST: /api/house/:houseID/char', function() {
    describe('with a valid house id and char body', () => {
      before(done => {
        new House(exampleHouse).save()
        .then(house => {
          this.tempHouse = house;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          House.remove({}),
          Char.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a character', done => {
        request.post(`${url}/api/house/${this.tempHouse._id}/char`)
        .send(exampleChar)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(exampleChar.name);
          expect(res.body.houseID).to.equal(this.tempHouse._id.toString());
          done();
        });
      });
    });
  });

  describe('PUT: /api/house/:houseID/char/:id', function() {
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
        Promise.all([
          House.remove({}),
          Char.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a character', done => {
        var updated = { name: 'Darth Vader' };

        request.post(`${url}/api/house/${this.tempHouse._id}/char`)
        .send(exampleChar)
        .then(() => {
          request.put(`${url}/api/house/${this.tempHouse._id}/char/${this.tempHouse}`)
          .send(updated)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(updated.name);
            done();
          });
        });
      });
    });
  });
});
