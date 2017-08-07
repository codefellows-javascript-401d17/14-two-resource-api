'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('pokemon:pokemon-router');
const Trainer = require('../model/trainer.js');
const Pokemon = require('../model/pokemon.js');

const pokemonRouter = module.exports = new Router();

pokemonRouter.post('/api/pokemon/:pokemonID/pokemon', jsonParser, function(req, res, next){
  debug('POST: /api/pokemon/:pokemonID/pokemon');

  Trainer.findByIdAndAddPokemon(req.params.trainerID, req.body)
  .then( pokemon => res.json(pokemon))
  .catch(next);
});

pokemonRouter.get('/api/pokemon/:pokemonID/pokemon/:id', function(req, res, next){
  debug('GET: /api/pokemon/:pokemonID/pokemon/:id');

  Pokemon.findById(req.params.id)
  .then(pokemon => res.json(pokemon))
  .catch(next);
});

pokemonRouter.put('/api/pokemon/:pokemonID/pokemon/:id',jsonParser , function(req, res, next) {
  debug('PUT: /api/pokemon/:pokemonID/pokemon/:id');

  if(Object.keys(req.body).length === 0) {
    Pokemon.findById(req.params.id)
    .then(pokemon => {
      res.status(400);
      res.json(pokemon);
    })
    .catch(next);
    return;
  }

  Pokemon.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(pokemon => res.json(pokemon))
  .catch(next);
});

pokemonRouter.delete('/api/pokemon/:pokemonID/pokemon/:id', function (req, res , next) {
  debug('DELETE: /api/pokemon/:pokemonID/pokemon/:id');

  Pokemon.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send())
  .catch(next);
});