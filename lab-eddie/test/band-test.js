'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');

const Band = require('../model/band.js');
const Album = require('../model/album.js');
const PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;
const url = `http://localhost:${PORT}`;
require('../server.js');

const modelBand = {
  name: 'Led Zeppelin',
  genre: 'Rock',
  homeTown: 'London',
};

const modelAlbum = {
  title: 'Led Zeppelin IV',
  genre: 'Rock',
  datePublished: new Date('11 8 1971')
};

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
      });
      it('Should return a body', (done) => {
        request.post(`${url}/api/band`)
        .send(modelBand)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Led Zeppelin');
          expect(res.body.homeTown).to.equal('London');
          this.tempBand = res.body;
          done();
        });
      });
    });
    describe('with an invalid body', function() {
      it('should return a 400 status code', done => {
        request.post(`${url}/api/band`, err => {
          expect(err.status).to.equal(400);
          done();
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
            done();
          })
          .catch(done);
        });

        after(done => {
          if(this.band) {
            Band.remove({})
            .then(() => done())
            .catch(done);
            return;
          }
          done();
        });

        it('Should return a 200 code and req body', (done) => {
          request.get(`${url}/api/band/${this.band._id}`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body._id).to.equal(this.band._id.toString());
            expect(res.body.name).to.equal(this.band.name);
            expect(res.body._id).to.equal(this.album.bandID.toString());
            expect(res.body.genre).to.equal(this.band.genre);
            expect(this.album._id.toString()).to.equal(res.body.albums[0]._id);
            done();
          });
        });
      });
    });

    describe('With an invalid ID', function(){
      it('should return a 404 status code', (done) => {
        request(`${url}/api/band/666`)
        .end((err) => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT /api/band', function() {
    describe('with a valid id and body', function() {
      before(done => {
        new Band(modelBand).save()
        .then(band => {
          this.band = band;
          done();
        })
        .catch(done);
      });

      after(done => {
        if(this.band) {
          Band.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('It should return a 200 code and req.body', (done) => {
        request.put(`${url}/api/band/${this.band._id}`)
        .send({name: 'Black Sabbath', genre: 'Heavy Metal'})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(this.band._id.toString());
          expect(res.body.name).to.not.equal(this.band.name);
          done();
        });
      });
    });

    describe('With an invalid ID but valid body', function() {
      before(done => {
        new Band(modelBand).save()
        .then(band => {
          this.band = band;
          done();
        })
        .catch(done);
      });

      after(done => {
        if(this.band) {
          Band.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('Should return a 404 error', done => {
        request.put(`${url}/api/band/666`)
        .send({name: 'Black Sabbath', genre: 'Heavy Metal'})
        .end((err) => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });

    describe('With a valid id but no body', function() {
      it('Should return a 400 error', done => {
        request.put(`${url}/api/band/666`)
        .end((err) => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
  });
});
