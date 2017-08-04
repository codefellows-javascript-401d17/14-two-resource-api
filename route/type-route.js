'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('pokemon:type-route');
const createError = require('http-errors');
const Pokemon = require('../model/pokemon.js');
const Type = require('../model/type.js');

const typeRouter = module.exports = new Router();

typeRouter.post('/api/pokemon/:pokemonID/type', jsonParser, function(req, res, next) {
  debug('POST: /api/pokemon/:pokemonID/type');

  Pokemon.findByIdAndAddType(req.params.pokemonID, req.body)
   .then(type => res.json(type))
   .catch(next);
});

typeRouter.get('/api/pokemon/:pokemonID/type/:id', function(req, res, next) {
  debug('GET: /api/pokemon/:pokemonID/type/:id');

  Type.findById(req.params.id)
  .then(type => res.json(type))
  .catch(err => next(createError(404, err.message)));
});

typeRouter.put('/api/pokemon/:pokemonID/type/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/pokemon/:pokemonID/type/:id');

  if(!req.body.name) return next(createError(400, res.message));

  Type.findByIdAndUpdate(req.params.id, req.body, {'new': true})
  .then(type => res.json(type))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

typeRouter.delete('/api/pokemon/:pokemonID/type/:id', function(req, res, next) {
  debug('DELETE: /api/pokemon/:pokemonID/type/:id');

  Type.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});