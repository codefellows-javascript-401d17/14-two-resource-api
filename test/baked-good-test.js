'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Bakery = require('../model/bakery.js');
const BakedGood = require('../model/bakedgood.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleBakedGood = {
  name: 'test: baked good',
  description: 'test: really delicious',
  calories: 500
};

const exampleBakery = {
  name: 'test: bakery',
  timestamp: new Date()
};

describe('Baked Good Routes', function() {
  describe('POST: /api/bakery/:bakeryID/bakedgood', function() {
    describe('with a valid bakery id and bakedgood body', () => {
      before( done => {
        new Bakery(exampleBakery).save()
        .then( bakery => {
          this.tempBakery = bakery;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Bakery.remove({}),
          BakedGood.remove({})
        ])
        .then( () => done())
        .catch(done);
      });

      it('should return a bakedgood', done => {
        request.post(`${url}/api/bakery/${this.tempBakery._id}/bakedgood`)
        .send(exampleBakedGood)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.name).to.equal(exampleBakedGood.name);
          expect(res.body.bakeryID).to.equal(this.tempBakery._id.toString());
          done();
        });
      });
    });
  });

  describe('GET: /api/bakedgood/:id', function() {
    describe('with a valid id', function() {
      before( done => {
        new BakedGood(exampleBakedGood).save()
        .then( bakedGood => {
          console.log(bakedGood);
          this.tempBakedGood = bakedGood;
          done();
        })
        .catch(done);
      });

      after( done => {
        if (this.tempBakedGood) {
          BakedGood.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a valid baked good', done => {
        request.get(`${url}/api/bakedgood/${this.tempBakedGood._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});
