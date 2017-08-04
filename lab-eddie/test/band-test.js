'use strict';

const expect = require('chai').expect;
const request = require('superagent')
const mongoose = require('mongoose');

const Band = require('../model/band.js');
const Album = require('../model/album.js');
const PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;
const url = `http://localhost:${PORT}`;
require('../server.js')

const modelBand = {
  name: 'Led Zeppelin',
  genre: 'Rock',
  homeTown: 'London',
}

const modelAlbum = {
  title: 'Led Zeppelin IV',
  genre: 'Rock',
  datePublished: new Date('11 8 1971')
}

describe('Band Routes', function(){
  describe('POST /api/band', function(){
    describe('With a valid req.body', () => {
      after(done => {
        if(this.tempBand) {
          Album.remove({})
          .then(() => done())
          .catch(err => done(err));
          return;
        }
        done();
      })
      it('Should return a body', (done) => {
        console.log(`${url}/api/band`)
        request.post(`${url}/api/band`)
        .send(modelBand)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Led Zeppelin');
          expect(res.body.homeTown).to.equal('London');
          this.tempBand = res.body;
          done()
        })
      })
    });
  });
});