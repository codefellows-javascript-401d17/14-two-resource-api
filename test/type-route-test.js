'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Pokemon = require('../model/pokemon.js');
const Type = require('../model/type.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleType = {
  name: 'test pokemon name',
  origin: 'test pokemon origin'
};

const examplePokemon = {
  name: 'test pokemon name',
  type: 'test pokemon type'
};

describe('Type Routes', function() {
  describe('POST: /api/pokemon/:pokemonID/type', function() {
    describe('with a valid id and a type body', () => {
      before(done => {
        new Pokemon(examplePokemon).save()
        .then(pokemon => {
          this.tempPokemon  = pokemon;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Pokemon.remove({}),
          Type.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a type', done => {
        request.post(`${url}/api/pokemon/${this.tempPokemon._id}/type`)
        .send(exampleType)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleType.name);
          expect(res.body.pokemonID).to.equal(this.tempPokemon._id.toString());
          done();
        });
      });
    });
  });

  describe('GET: /api/pokemon/:pokemonID/type/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Pokemon(examplePokemon).save()
        .then(pokemon => {
          this.tempPokemon = pokemon;
          return Pokemon.findByIdAndAddType(pokemon._id, exampleType);
        })
        .then(type => {
          this.tempType = type;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Pokemon.remove({}),
          Type.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a type', done => {
        request.get(`${url}/api/pokemon/${this.tempPokemon._id}/type/${this.tempType._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test pokemon name');
          expect(res.body.type).to.equal('test pokemon type');
          done();
        });
      });

      it('should return 404 not found', done => {
        request.get(`${url}/api/pokemon/${this.tempPokemon._id}/type/123469`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('PUT: /api/pokemon/:pokemonID/type/:id', function() {
    describe('with a valid body', function() {
      before(done => {
        new Pokemon(examplePokemon).save()
        .then(pokemon => {
          this.tempPokemon = pokemon;
          return Pokemon.findByIdAndAddType(pokemon._id, exampleType);
        })
        .then(type => {
          this.tempType = type;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Pokemon.remove({}),
          Type.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a type', done => {
        request.put(`${url}/api/pokemon/${this.tempPokemon._id}/type/${this.tempType._id}`)
        .send({ name: 'new pokemon name', type: 'new pokemon type'})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('new pokemon name');
          expect(res.body.type).to.equal('new pokemon type');
          done();
        });
      });

      it('should return 400 bad request', done => {
        request.put(`${url}/api/pokemon/${this.tempPokemon._id}/type/${this.tempType._id}`)
        .send({nothing: 'nothing'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });

      it('should return 404 not found', done => {
        request.put(`${url}/api/pokemon/${this.tempPokemon._id}/type/12476291`)
        .send({name: 'new pokemon name', type: 'new pokemon type'})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('DELETE: /api/pokemon/:pokemonID/type/:id', function() {
    describe('with valid id', function() {

      before(done => {
        new Pokemon(examplePokemon).save()
        .then(pokemon => {
          this.tempPokemon = pokemon;
          return Pokemon.findByIdAndAddType(pokemon._id, exampleType);
        })
        .then(type => {
          this.tempType = type;
          done();
        })
        .catch(done);
      });

      it('should return 204', done => {
        request.delete(`${url}/api/pokemon/${this.tempPokemon._id}/type/${this.tempType._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });

      it('should return 404 not found', done => {
        request.delete(`${url}/api/pokemon/${this.tempPokemon._id}/type/12476291`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });
});