'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('pokemon:pokemon-route');
const createError = require('http-errors');
const Pokemon = require('../model/pokemon.js');

const pokemonRouter = module.exports = new Router();

pokemonRouter.post('/api/pokemon', jsonParser, function(req, res, next) {
  debug('POST: /api/pokemon');

  new Pokemon(req.body).save()
  .then(pokemon => res.json(pokemon))
  .catch(err => next(createError(400, err.message)));
});

pokemonRouter.get('/api/pokemon/:id', function(req, res, next) {
  debug('GET: /api/pokemon/:id');

  Pokemon.findById(req.params.id)
  .populate('pokemons')
  .then(pokemon => res.json(pokemon))
  .catch(err => next(createError(404, err.message)));
});

pokemonRouter.put('/api/pokemon/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/pokemon/:id');

  if(!req.body.name) return next(createError(400, res.message));

  Pokemon.findByIdAndUpdate(req.params.id, req.body, {'new': true})
  .then(pokemon => res.json(pokemon))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

pokemonRouter.delete('/api/pokemon/:id', function(req, res, next) {
  debug('DELETE: /api/pokemon/:id');

  Pokemon.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});