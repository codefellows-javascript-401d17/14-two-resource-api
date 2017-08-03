'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('actor:movie-router');
const Movie = require('../model/movie.js');
const movieRouter = module.exports = new Router();

movieRouter.post('/api/movie', jsonParser, function(req, res, next) {
  debug('POST: /api/movie');

  req.body.dateReleased = new Date();
  new Movie(req.body).save()
  .then( movie => res.json(movie))
  .catch(next);
});

movieRouter.get('/api/movie/:id', function(req, res, next) {
  debug('GET: /api/movie');

  Movie.findById(req.params.id)
    .then( movie => res.json(movie))
    .catch(next);
});

movieRouter.put('/api/movie/:id', function(req,res,next) {
  debug('PUT: /api/band/:id');

  Movie.findByIdAndUpdate(req.params.id, req.body, { 'new': true }) //maybe need {new:true}?
  .then(movie => res.json(movie))
  .catch(next);
});

movieRouter.delete('/api/movie/:id', function(req, res, next) {
  debug('DELETe: /api/movie');
  Movie.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
});
