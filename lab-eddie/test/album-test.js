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
}

const modelAlbum = {
  title: 'Led Zeppelin IV',
  genre: 'Rock',
  datePublished: new Date('11 8 1971')
}

describe('Album Routes', function() {
  describe('POST /api/band/:id/album', function() {
    describe('with a valid parent and id', () => {
      before(done => {
        new Band(modelBand).save()
        .then(band => {
          this.band = band;
          done()
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
      })

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
        })
      })
    });
    describe('with an invalid band id', () => {
      before(done => {
        new Band(modelBand).save()
        .then(band => {
          this.band = band;
          done()
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
      })

      it('should return a 200 code and a req.body', done => {
        request.post(`${url}/band/666/album`)
        .send(modelAlbum)
        .end((err, res) => {
          expect(err.status).to.equal(404);
          done();
        })
      })
    });

  });

  describe('GET /api/band/:id/album/:albumID', function() {

  });

  describe('PUT /api/band/:id/album/:albumID', function() {

  });
});