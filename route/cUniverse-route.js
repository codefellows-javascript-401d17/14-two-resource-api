'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('superhero:cUniverse-router');
const createError = require('http-errors');
const CUniverse = require('../model/cUniverse.js');
const cUniverseRouter = module.exports = new Router();

cUniverseRouter.post('/api/cUniverse', jsonParser, function(req, res, next) {
  debug('POST: /api/cUniverse');

  req.body.timestamp = new Date();
  new CUniverse(req.body).save()
  .then( cUniverse => res.json(cUniverse))
  .catch(next);
});

cUniverseRouter.get('/api/cUniverse/:id', function(req, res, next) {
  debug('GET: /api/cUniverse');

  CUniverse.findById(req.params.id)
  .populate('superheroes')
  .then( cUniverse => res.json(cUniverse))
  .catch(next);
});

cUniverseRouter.put('/api/cUniverse/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/cUniverse/:id');

  CUniverse.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( cUniverse => res.json(cUniverse))
  .catch( err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

cUniverseRouter.delete('/api/cUniverse/:id', function(req, res, next) {
  debug('DELETE: /api/cUniverse/:id');

  CUniverse.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
