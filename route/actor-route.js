'use strict';
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('movie:actor-router');
const Movie = require('../model/movie.js');
const Actor = require('../model/actor.js');
const createError = require('http-errors');

const actorRouter = module.exports = new Router();

actorRouter.post('/api/movie/:movieID/actor', jsonParser, function(req, res, next) {
  debug('POST: /api/movie/:movieID/actor');

  Movie.findByIdAndAddActor(req.params.movieID, req.body)
  .then( actor => res.json(actor))
  .catch(next);
});

actorRouter.get('/api/movie:id', function(req, res, next){
  debug('GET: /api/actor/:id');

  Actor.findById(req.params.id)
  .then( actor => res.json(actor))
  .catch(err => next(createError(404, err.message)));
});

actorRouter.put('/api/actor/:id', jsonParser, function(req, res, next) {
  debug('PUT:/api/actor/:id');

  Actor.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( actor => res.json(actor))
  .catch( err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

actorRouter.delete('/api/actor/:id', function(req, res, next){
  debug('delete: /api/baseball/:id');

  Actor.findByIdAndRemove(req.params.id)
  .then( actor => res.json(actor))
  .catch( err=> {
    if(err.name ==='ValidationError') return next(err);
    next(createError(404, err.message));
  });
});
