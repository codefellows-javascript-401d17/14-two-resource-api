'use strict'

const expect = require('chai').expect;
const request = require('superagent');
const Movie = require('../model/movie.js');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

mongoose.Promise = Promise;
require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleMovie = {
  name: 'test movie name'
};

describe('Movie Routes', function(){
  describe('POST: /api/movie', function(){
    describe('with a valid req body', function() {
      after (done => {
        if (this.tempMovie){
          Movie.remove({})
          .then( () => done())
          .catch(done);
          console.log('finished valid req body')
          return;
        }
        done();
      });

      it('should return a movie', done => {
        request.post(`${url}/api/movie`)
        .send(exampleMovie)
        .end((err,res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test movie name');
          this.tempMovie = res.body;
          done();
        });
      });
    });
  });

  describe('GET: /api/movie/:id', function(){
    describe('with a valid body', function() {
      before(done => {
        exampleMovie.dateReleased = new Date();
        new Movie(exampleMovie).save()
        .then( movie => {
          this.tempMovie = movie;
          done();
        })
        .catch(done);
      });

      after(done => {
        delete exampleMovie.dateReleased;
        if(this.tempMovie) {
          Movie.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a movie', done => {
        request.get(`${url}/api/movie/${this.tempMovie._id}`)
        .end((err ,res)=> {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test movie name');
          done();
        });
      });
    });
  });

  describe('PUT: /api/movie', function(){
    describe('with a valid body', function(){
      before(done => {
        exampleMovie.dateReleased = new Date();
        new Movie(exampleMovie).save()
        .then( movie => {
          this.tempMovie = movie;
          done();
        })
        .catch(done);
      });

      after(done => {
        delete exampleMovie.dateReleased;
        if(this.tempMovie) {
          Movie.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a 200 and update the movie', done =>{
        request.put(`${url}/api/movie/${this.tempMovie._id}`)
        .send({name:'a new movie'})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

  describe('DELETE: /api/movie', function(){
    before(done => {
      exampleMovie.dateReleased = new Date();
      new Movie(exampleMovie).save()
      .then( movie => {
        this.tempMovie = movie;
        done();
      })
      .catch(done);
    });

    it('should delete a movie', done => {
      request.delete(`${url}/api/movie/${this.tempMovie._id}`, function(error, response) {
        expect(response.status).to.equal(204);
        done();
      });
    });
  });
});
