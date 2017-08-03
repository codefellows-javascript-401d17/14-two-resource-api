'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('char:char-router');
const createError = require('http-errors');

const House = require('../model/house.js');
const Char = require('../model/char.js');

const charRouter = module.exports = new Router();

charRouter.post('/api/house/:houseID/char', jsonParser, function(req, res, next) {
  debug('POST: /api/house/:houseID/char');

  House.findByIdAndAddChar(req.params.houseID, req.body)
  .then(char => res.json(char))
  .catch(next);
});

charRouter.get('/api/house/:houseID/char/:id', function(req, res, next) {
  debug('GET: /api/house/:houseID/char/:id');

  Char.findById(req.params.id)
  .then(char => res.json(char))
  .catch(next);
});

charRouter.put('/api/house/:houseID/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/house/:houseID/:id');

  Char.findByIdAndUpdate(req.params.id, req.body, {new: true })
  .then(char => res.json(char))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

charRouter.delete('/api/house/:houseID/:id', function(req, res, next) {
  debug('DELETE: /api/house/:id');

  Char.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
