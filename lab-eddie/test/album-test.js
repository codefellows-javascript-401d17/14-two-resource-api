'use strict';

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const Band = require('../model/band.js');
const Album = require('../model/album.js');
const PORT = process.env.PORT || 3000;
const url = `localhost:${PORT}/api`;

mongoose.Promise = Promise;
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

describe('Album Routes', function() {
  describe('POST /api/band/:id/album', function() {
    describe('with a valid parent and id', () => {
      before(done => {
        new Band(modelBand).save()
        .then(band => {
          this.band = band;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Band.remove({}),
          Album.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a 200 code and a req.body', done => {
        console.log(`${url}/band/${this.band._id}/album`);
        request.post(`${url}/band/${this.band._id}/album`)
        .send(modelAlbum)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(modelAlbum.name);
          expect(res.body.genre).to.equal(modelAlbum.genre);
          expect(new Date(res.body.datePublished).toString())
          .to.equal(modelAlbum.datePublished.toString());
          done();
        });
      });
    });
    describe('with an invalid band id', () => {
      before(done => {
        new Band(modelBand).save()
        .then(band => {
          this.band = band;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Band.remove({}),
          Album.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a 404 error code', done => {
        request.post(`${url}/band/666/album`)
        .send(modelAlbum)
        .end((err) => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });

    describe('with an invalid body', () => {
      before(done => {
        new Band(modelBand).save()
        .then(band => {
          this.band = band;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Band.remove({}),
          Album.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a 404 error code', done => {
        request.post(`${url}/band/${this.band._id}/album`)
        .send(modelBand)
        .end((err) => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });

  });

  describe('GET /api/band/:id/album/:albumID', function() {
    describe('With a valid band ID and album ID', function(){
      before(done => {
        new Band(modelBand).save()
        .then(band => this.band = band)
        .then(() => Band.findByIdAndAddAlbum(this.band._id, modelAlbum))
        .then(album => {
          this.album = album;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Band.remove({}),
          Album.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a 200 code and a req body', done => {
        request.get(`${url}/band/${this.band._id}/album/${this.album._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.album.name);
          expect(res.body._id).to.equal(this.album._id.toString());
          expect(res.body.bandID).to.equal(this.band._id.toString());
          done();
        });
      });
    });
    describe('With a valid band ID and album ID', function(){
      before(done => {
        new Band(modelBand).save()
        .then(band => this.band = band)
        .then(() => Band.findByIdAndAddAlbum(this.band._id, modelAlbum))
        .then(album => {
          this.album = album;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Band.remove({}),
          Album.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a 404 code', done => {
        request.get(`${url}/band/${this.band._id}/album/666`)
        .end((err) => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT /api/band/:id/album/:albumID', function() {
    describe('With a valid band ID, album ID and body', function(){
      before(done => {
        new Band(modelBand).save()
        .then(band => this.band = band)
        .then(() => Band.findByIdAndAddAlbum(this.band._id, modelAlbum))
        .then(album => {
          this.album = album;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Band.remove({}),
          Album.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a 200 code and a req body', done => {
        request.put(`${url}/band/${this.band._id}/album/${this.album._id}`)
        .send({title: 'Masters of Reality'})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.album.name);
          expect(res.body._id).to.equal(this.album._id.toString());
          expect(res.body.genre).to.equal(this.album.genre);
          done();
        });
      });
    });
  });

});
