'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Band = require('../model/band.js');
const Song = require('../model/song.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleSong = {
  name: 'test song name',
  year: 'test song year'
};

const exampleBand = {
  name: 'test band name',
  origin: 'test band origin'
};

describe('Song Routes', function() {

  describe('POST: /api/band/:bandID/song', function() {
    describe('with a valid id and a song body', () => {
      before( done => {
        new Band(exampleBand).save()
        .then( band => {
          this.tempBand = band;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Band.remove({}),
          Song.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a song', done => {
        request.post(`${url}/api/band/${this.tempBand._id}/song`)
        .send(exampleSong)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleSong.name);
          expect(res.body.bandID).to.equal(this.tempBand._id.toString());
          done();
        });
      });
    });
  });

  describe('GET: /api/band/:bandID/song/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Band(exampleBand).save()
        .then( band => {
          this.tempBand = band;
          return Band.findByIdAndAddSong(band._id, exampleSong);
        })
        .then(song => {
          this.tempSong = song;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Band.remove({}),
          Song.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a song', done => {
        request.get(`${url}/api/band/${this.tempBand._id}/song/${this.tempSong._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test song name');
          expect(res.body.year).to.equal('test song year');
          done();
        });
      });

      it('should return 404 not found', done => {
        request.get(`${url}/api/band/${this.tempBand._id}/song/123469`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('PUT: /api/band/:bandID/song/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Band(exampleBand).save()
        .then( band => {
          this.tempBand = band;
          return Band.findByIdAndAddSong(band._id, exampleSong);
        })
        .then(song => {
          this.tempSong = song;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Band.remove({}),
          Song.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a song', done => {
        request.put(`${url}/api/band/${this.tempBand._id}/song/${this.tempSong._id}`)
        .send({ name: 'new song name', year: 'new song year'})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('new song name');
          expect(res.body.year).to.equal('new song year');
          done();
        });
      });

      it('should return 400 bad request', done => {
        request.put(`${url}/api/band/${this.tempBand._id}/song/${this.tempSong._id}`)
        .send({ nothing: 'nothing' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        });
      });

      it('should return 404 not found', done => {
        request.put(`${url}/api/band/${this.tempBand._id}/song/12476291`)
        .send({ name: 'new song name', year: 'new song year'})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('DELETE: /api/band/:bandID/song/:id', function() {
    describe('with valid id', function() {

      before( done => {
        new Band(exampleBand).save()
        .then( band => {
          this.tempBand = band;
          return Band.findByIdAndAddSong(band._id, exampleSong);
        })
        .then(song => {
          this.tempSong = song;
          done();
        })
        .catch(done);
      });

      it('should return 204', done => {
        request.delete(`${url}/api/band/${this.tempBand._id}/song/${this.tempSong._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });

      it('should return 404 not found', done => {
        request.delete(`${url}/api/band/${this.tempBand._id}/song/12476291`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });
});
