'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const House = require('../model/house.js');
const Character = require('../model/character.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleCharacter = {
  name: 'Paul'
}

const updateCharacter = {
  name: "Muad\'dib"
}

const exampleHouse = {
  name: 'Atreides',
  seat: 'Caladan',
  region: 'Delta Pavonis',
  words: 'Fear is the Mind-Killer',
  timestamp: new Date
}

describe('Character Routes', function() {
  describe('POST: /api/house/:houseID/character', function() {
    describe('with a valid house id and character body', () => {
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
          Character.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a character', done => {
        request.post(`${url}/api/house/${this.tempHouse._id}/character`)
        .send(exampleCharacter)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal('Paul');
          expect(res.body.houseID).to.equal(this.tempHouse._id.toString());
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
        done();
      });

      it('should return a character', done => {

      })
    })
  })
});
