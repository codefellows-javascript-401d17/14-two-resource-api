'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Bakery = require('../model/bakery.js');
const bakedGood = require('../model/bakedgood.js');
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
  });

  describe('GET: /api/bakery/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Bakery(exampleBakery).save()
        .then( bakery => {
          this.tempBakery = bakery;
          console.log('function return:', Bakery.findByIdAndAddBakedGood(bakery._id, exampleBakedGood));
          return Bakery.findByIdAndAddBakedGood(bakery._id, exampleBakedGood);
        })
        .then( bakedGood => {
          this.tempBakedGood = bakedGood;
          done();
        })
        .catch(done);
      });

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
        request.get(`${url}/api/bakery/${this.tempBakery._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});

