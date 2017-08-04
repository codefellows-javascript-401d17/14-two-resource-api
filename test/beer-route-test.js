'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Beer = require('../model/beer.js');
const Brewery = require('../model/brewery.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleBeer = {
  name: 'test beer',
  style: 'test style',
  ibu: '45'
};

const exampleBrewery = {
  name: 'the brewery name',
  address: 'the address',
  phoneNumber: '555-555-5555',
  timestamp: new Date()
};

describe('Beer Routes', function(){
  describe('POST :/api/brewery/:breweryID/beer', function(){
    describe('with a valid list id and beer body', () => {
      before( done => {
        new Brewery(exampleBrewery).save()
        .then( brewery => {
          this.tempBrewery = brewery;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Brewery.remove({}),
          Beer.remove({})
        ])
        .then( () => done())
        .catch(done);
      });

      it('should return a beer', done => {
        request.post(`${url}/api/brewery/${this.tempBrewery._id}/beer`)
        .send(exampleBeer)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(exampleBeer.name);
          expect(res.body.style).to.equal(exampleBeer.style);
          expect(res.body.ibu).to.equal(exampleBeer.ibu);
          done();
        });
      });
    });
  });
});
