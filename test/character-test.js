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
};

const updateCharacter = {
  name: 'Muad\'dib'
};

const exampleHouse = {
  name: 'Atreides',
  seat: 'Caladan',
  region: 'Delta Pavonis',
  words: 'Fear is the Mind-Killer',
  timestamp: new Date
};

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
        .end((err, response) => {
          if(err) return done(err);
          expect(response.body.name).to.equal('Paul');
          expect(response.body.houseID).to.equal(this.tempHouse._id.toString());
          done();
        });
      });
    });
  });

  describe('GET: /api/house/:houseID/character/:id', function() {
    describe('with a valid body', function() {
      before(done => {
        new House(exampleHouse).save()
        .then(house => {
          this.tempHouse = house;
          return House.findByIdAndAddCharacter(house._id, exampleCharacter);
        })
        .then(character => {
          this.tempCharacter = character;
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
        request.get(`${url}/api/house/${this.tempHouse._id}/character/${this.tempCharacter._id}`)
        .end((err, response) => {
          if(err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal('Paul');
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
          return House.findByIdAndAddCharacter(house._id, exampleCharacter);
        })
        .then(character =>  {
          this.tempCharacter = character;
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
        request.put(`${url}/api/house/${this.tempHouse._id}/character/${this.tempCharacter._id}`)
        .send(updateCharacter)
        .end((err, response) => {
          if(err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal('Muad\'dib');
          done();
        });
      });
    });
  });

  describe('DELETE: /api/house/:houseID/character/:id', function(){
    describe('with valid id', function() {
      before(done => {
        new House(exampleHouse).save()
        .then(house => {
          this.tempHouse = house;
          return House.findByIdAndAddCharacter(house._id, exampleCharacter);
        })
        .then(character => {
          this.tempCharacter = character;
          done();
        })
        .catch(done);
      });

      it('should return 204 status', done => {
        request.delete(`${url}/api/house/${this.tempHouse._id}/character/${this.tempCharacter._id}`)
        .end((err, response) => {
          expect(response.status).to.equal(204);
          done();
        });
      });
    });
  });
});
