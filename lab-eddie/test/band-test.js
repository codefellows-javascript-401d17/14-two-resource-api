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
    describe('with an invalid body', function() {
      it('should return a 400 status code', () => {
        request.post(`${url}/api/band`, err => {
          expect(err.status).to.equal(400);
          done(err);
        });
      });
    });
  });
  describe('GET /api/band', function(){
    describe('Should return a 200 status code and req.body', function() {
      describe('with a valid req', function() {

        before(done => {
          new Band(modelBand).save()
          .then( band => {
            this.band = band;
            return Band.findByIdAndAddAlbum(band._id, modelAlbum);
          })
          .then(album => {
            this.album = album;
            done()
          })
          .catch(done);
        });

        after(done => {
          if(this.band) {
            Band.remove({})
            .then(() => done)
            .catch(done);
            return;
          }
          done();
        });

        it('Should return a 200 code and req body', done => {
          request.get(`${url}/api/band/${this.band._id}`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body._id).to.equal(this.band._id.toString());
            done()
          });
        });
      })
    })
  });
});