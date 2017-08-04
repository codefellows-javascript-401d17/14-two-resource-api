'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Movie = require('../model/movie.js');
const Actor = require('../model/actor.js');

const PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleMovie = {
  name: 'test movie name',
  dateReleased: new Date()
};

const exampleActor = {
  name: 'Nickypoo',
  age: 25
};

describe('Actor Tests', function(){
  describe('POST: api/movie/:movieID/actor', function(){
    describe('with a valid body', () =>{
      before( done =>{
        new Movie(exampleMovie).save()
        .then( movie =>{
          this.tempMovie = movie;
          done();
        })
        .catch(done);
      });


      after( done => {
        Promise.all([
          Movie.remove({}),
          Actor.remove({})
        ])
        .then( () => done())
        .catch(done);
      });

      it('should return an actor', done => {
        request.post(`${url}/api/movie/${this.tempMovie._id}/actor`)
        .send(exampleActor)
        .end((err,res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleActor.name);
          expect(res.body.age).to.equal(exampleActor.age);
          done();
        })
      })
    })
  })
})
