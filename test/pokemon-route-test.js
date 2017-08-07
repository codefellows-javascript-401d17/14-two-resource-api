'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Pokemon = require('../model/pokemon.js');
const Trainer = require('../model/trainer.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const examplePokemon = {
  name: 'test pokemon',
  type: 'test type',
  gen: 'test gen'
};

const exampleNewPokemon = {
  name: 'test new pokemon',
  type: 'test new type',
  gen: 'test new gen'
};

const exampleTrainer = {
  name: 'test name',
  badges: 'test badges',
  pokedex: '52',
  timestamp: new Date()
};

describe('Pokemon Routes', function(){
  describe('POST :/api/pokemon/:pokemonID/pokemon', function(){
    describe('with a valid list id and pokemon body', () => {
      before(done => {
        new Trainer(exampleTrainer).save()
        .then(trainer => {
          this.tempTrainer = trainer;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Trainer.remove({}),
          Pokemon.remove({})
        ])
        .then( () => done())
        .catch(done);
      });

      it('should return a pokemon', done => {
        request.post(`${url}/api/brewery/${this.tempBrewery._id}/beer`)
        .send(examplePokemon)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(examplePokemon.name);
          expect(res.body.type).to.equal(examplePokemon.type);
          expect(res.body.gen).to.equal(examplePokemon.gen);
          done();
        });
      });
    });
  });
  describe('GET: /api/pokemon/:pokemonID/pokemon/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Trainer(exampleTrainer).save()
        .then(trainer => {
          this.tempTrainer = trainer;
          return Trainer.findByIdAndAddPokemon(trainer._id, examplePokemon);
        })
        .then(pokemon => {
          this.tempPokemon = pokemon;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Trainer.remove({}),
          Pokemon.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a pokemon', done => {
        request.get(`${url}/api/pokemon/${this.tempPokemon._id}/pokemon/${this.tempPokemon._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test beer');
          expect(res.body.type).to.equal('test type');
          expect(res.body.gen).to.equal('test gen');
          done();
        });
      });

      it('should return 404 not found', done => {
        request.get(`${url}/api/pokemon/${this.tempPokemon._id}/pokemon/156870`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT: /api/pokemon/:pokemonID/beer/:id', function() {
    describe('with a valid body', function() {
      before(done => {
        new Trainer(exampleTrainer).save()
        .then(trainer => {
          this.tempTrainer = trainer;
          return Trainer.findByIdAndAddPokemon(trainer._id, examplePokemon);
        })
        .then(pokemon => {
          this.tempPokemon = pokemon;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Trainer.remove({}),
          Pokemon.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a pokemon', done => {
        request.put(`${url}/api/pokemon/${this.tempPokemon._id}/pokemon/${this.tempPokemon._id}`)
        .send(exampleNewPokemon)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test new name');
          expect(res.body.type).to.equal('test new type');
          expect(res.body.gen).to.equal('test new gen');
          done();
        });
      });

      it('should return 400 bad request', done => {
        request.put(`${url}/api/pokemon/${this.tempPokemon._id}/pokemon/${this.tempPokemon._id}`)
        .send(null)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });

      it('should return 404 not found', done => {
        request.put(`${url}/api/pokemon/${this.tempPokemon._id}/pokemon/16432345`)
        .send(null)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('DELETE: /api/pokemon/:pokemonID/pokemon/:id', function() {
    describe('with valid id', function() {

      before(done => {
        new Trainer(exampleTrainer).save()
        .then(trainer => {
          this.tempTrainer= trainer;
          return Trainer.findByIdAndAddBeer(trainer._id, examplePokemon);
        })
        .then(pokemon => {
          this.tempPokemon = pokemon;
          done();
        })
        .catch(done);
      });

      it('should return 204', done => {
        request.delete(`${url}/api/pokemon/${this.tempPokemon._id}/pokemon/${this.tempPokemon._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });

      it('should return 404 not found', done => {
        request.delete(`${url}/api/pokemon/${this.tempPokemon._id}/pokemon/3278931`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});