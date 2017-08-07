'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Bakery = require('../model/bakery.js');
// const bakedGood = require('../model/bakedgood.js');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;
require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleBakery = {
  name: 'Test Bakery',
  timestamp: new Date()
};

const exampleBakedGood = {
  name: 'muffin',
  description: 'naked cupcake',
  calories: 240
};

describe('Bakery Routes', function() {
  describe('POST: /api/bakery', function() {
    describe('with a valid req body', function() {
      after( done => {
        if (this.tempBakery) {
          Bakery.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a bakery', done => {
        request.post(`${url}/api/bakery`)
        .send(exampleBakery)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          this.tempBakery = res.body;
          done();
        });
      });
    });

    describe('with an invalid body', function() {
      after( done => {
        if ( this.tempBakery) {
          Bakery.remove({})
          .then( () => done())
          .catch(done);
          return;
        }

        done();
      });

      it('should return a 400', done => {
        request.post(`${url}/api/bakery`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('GET: /api/bakery/:id', function() {
    describe('with a valid body', function() {
      beforeEach( done => {
        new Bakery(exampleBakery).save()
        .then( (bakery) => {
          this.tempBakery = bakery;
          return Bakery.findByIdAndAddBakedGood(bakery._id, exampleBakedGood);
        })
        .then( bakedGood => {
          this.tempBakedGood = bakedGood;
          done();
        })
        .catch(done);
      });

      afterEach( done => {
        if (this.tempBakery) {
          Bakery.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a bakery', done => {
        request.get(`${url}/api/bakery/${this.tempBakery._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Test Bakery');
          done();
        });
      });

      it('should return a 404', done => {
        request.get(`${url}/api/bakery/12345`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT: /api/bakery/:id', function() {
    describe('with a valid body', function() {

      beforeEach( done => {
        new Bakery(exampleBakery).save()
        .then( bakery => {
          this.tempBakery = bakery;
          done();
        })
        .catch(done);
      });

      afterEach( done => {
        if (this.tempBakery) {
          Bakery.remove({})
          .then( () => done())
          .catch(done);
        }
      });

      it('should return an updated bakery', done => {
        var updated = { name: 'updated bakery' };

        request.put(`${url}/api/bakery/${this.tempBakery._id}`)
        .send(updated)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(updated.name);
          done();
        });
      });

      it('should return a 404', done => {
        let updated = { name: '404 bakery'};

        request.put(`${url}/api/bakery/12345`)
        .send(updated)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with an invalid body', function() {

      beforeEach( done => {
        new Bakery(exampleBakery).save()
        .then( bakery => {
          this.tempBakery = bakery;
          done();
        })
        .catch(done);
      });

      afterEach( done => {
        if (this.tempBakery) {
          Bakery.remove({})
          .then( () => done())
          .catch(done);
        }
      });

      it('should return a 400', done => {
        request.put(`${url}/api/bakery/${this.tempBakery._id}`)
        .send()
        .end((err, res) => {
          expect(res.status).equal(400);
          done();
        });
      });
    });
  });

  describe('DELETE: /api/bakery/:id', function() {
    describe('with a valid id', function() {

      before( done => {
        new Bakery(exampleBakery).save()
        .then( bakery => {
          this.tempBakery = bakery;
          done();
        })
        .catch(done);
      });

      it('should delete a bakery', done => {
        request.delete(`${url}/api/bakery/${this.tempBakery._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
});

