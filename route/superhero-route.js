'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('superhero:superhero-router');
const CUniverse = require('../model/cUniverse.js');
const Superhero = require('../model/superhero.js');
const createError = require('http-errors');

const superheroRouter = module.exports = new Router();

superheroRouter.post('/api/cUniverse/:cUniverseID/superhero', jsonParser, function(req, res, next) {
  debug('POST: /api/cUniverse/:cUniverseID/superhero');

  CUniverse.findByIdAndAddSuperhero(req.params.cUniverseID, req.body)
  .then( superhero => res.json(superhero))
  .catch(next);
});

superheroRouter.get('/api/cUniverse/:cUniverseID/superhero/:id', function(req, res, next) {
  debug('GET: /api/cUniverse/:cUniverseID/superhero');

  Superhero.findById(req.params.id)
  .then( superhero => res.json(superhero))
  .catch(next);
});

superheroRouter.put('/api/superhero/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/cUniverse/:cUniverseID/superhero');

  Superhero.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( superhero => res.json(superhero))
  .catch( err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

superheroRouter.delete('/api/cUniverse/:cUniverseID/superhero/:id', function(req, res, next) {
  debug('DELETE: /api/cUniverse/:cUniverseID/superhero');

  CUniverse.findByIdAndRemove(req.params.cUniverseID)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
