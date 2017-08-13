'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const House = require('../model/house.js');
const Character = require('../model/character.js');

const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
require('../server.js');
const url = `http://localhost:${PORT}`;

const exampleHouse = {
  name: 'Atreides',
  seat: 'Caladan',
  region: 'Delta Pavonis',
  words: 'Fear is the Mind-Killer',
  timestamp: new Date;
}

const updateHouse = {
  seat: 'Arrakeen',
  region: 'Arrakis'
}

const exampleCharacter = {
  name: 'Paul'
}

describe('House Routes', function() {
  describe('POST: /api/house', function() {
    describe('with a valid request body', function() {
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
        .end((err, response) => {
          if(err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal('Atreides');
          expect(response.body.seat).to.equal('Caladan');
          this.tempHouse = response.body;
          done();
        });
      });

      it('should return status 400', done => {
        request.post(`${url}/api/house/`)
        .send({ hodor: 'hodor' })
        .end((err, response) => {
          expect(response.status).to.equal(400);
        });
      });
    });
  });

  describe('GET: /api/house/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new House(exampleHouse).save()
        .then( house => {
          this.tempHouse = house;
          return House.findByIdAndAddCharacter(house._id, exampleCharacter);
        })
        .then(character => {
          this.tempCharacter = character;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempHouse) {
          House.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a house', done => {
        request.get(`${url}/api/house/${this.tempHouse._id}`)
        .end((err, response) => {
          if(err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal('Atreides');
          expect(response.body.characters.length).to.equal(1);
          expect(response.body.characters[0].name).to.equal('Paul');
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
        });
        .catch(done);
      });

      after(done => {
        if(this.tempHouse) {
          House.remove({})
          .then(() => done())
          .catch(done);
        }
        done();
      });

      it('should return a character', done => {
        request.put(`${url}/api/house/${this.tempHouse._id}`)
        .send(updateHouse)
        .end(err, response) => {
          if(err) return done(err);
          let timestamp = new Date(response.body.timestamp);
          expect(response.status).to.equal(200);
          expect(response.body.seat).to.equal('Arrakeen');
          expect(timestamp.toString()).to.equal(exampleHouse.timestamp.toString());
          done();
        }
      })
    });
  });
});
