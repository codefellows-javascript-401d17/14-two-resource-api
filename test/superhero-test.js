'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const CUniverse = require('../model/cUniverse.js');
const Superhero = require('../model/superhero.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleSuperhero = {
  name: 'test superhero name',
  powers: 'test powers'
};

const exampleCUniverse = {
  name: 'example cUniverse',
  timestamp: new Date()
};

describe('Superhero Routes', function() {
  describe('POST: /api/cUniverse/:cUniverseID/superhero', function() {
    describe('with a valid cUniverse id and superhero body', () => {
      before( done => {
        new CUniverse(exampleCUniverse).save()
        .then( cUniverse => {
          this.tempCUniverse = cUniverse;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          CUniverse.remove({}),
          Superhero.remove({})
        ])
        .then( () => done())
        .catch(done);
      });

      it('should return a superhero', done => {
        request.post(`${url}/api/cUniverse/${this.tempCUniverse._id}/superhero`)
        .send(exampleSuperhero)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.name).to.equal(exampleSuperhero.name);
          expect(res.body.cUniverseID).to.equal(this.tempCUniverse._id.toString());
          done();
        });
      });
    });
  });

  describe('GET: /api/cUniverse/:cUniverseID/superhero/:id', function() {
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
        Promise.all([
          CUniverse.remove({}),
          Superhero.remove({})
        ])
        .then( () => done())
        .catch(done);
      });

      it('should return a superhero', done => {
        request.get(`${url}/api/cUniverse/${this.tempCUniverse._id}/superhero/${this.tempSuperhero._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test superhero name');
          expect(res.body.powers).to.equal('test powers');
          done();
        });
      });
    });
  });

  describe('PUT: /api/superhero/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Superhero(exampleSuperhero).save()
        .then( superhero => {
          this.tempSuperhero = superhero;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          CUniverse.remove({}),
          Superhero.remove({})
        ])
        .then( () => done())
        .catch(done);
      });

      it('should return an updated superhero', done => {
        var updated = { name: 'updated name' };

        request.put(`${url}/api/superhero/${this.tempSuperhero._id}`)
        .send(updated)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(updated.name);
          done();
        });
      });
    });
  });
});
