'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('bakedGood:bakery-router');
const createError = require('http-errors');
const Bakery = require('../model/bakery.js');

const bakeryRouter = module.exports = new Router();


bakeryRouter.post('/api/bakery', jsonParser, function(req, res, next) {
  debug('POST: /api/bakery');

  req.body.timestamp = new Date();
  new Bakery(req.body).save()
  .then( bakery => res.json(bakery))
  .catch(next);
});

bakeryRouter.get('/api/bakery/:id', function(req, res, next) {
  debug('GET: /api/bakery');

  Bakery.findById(req.params.id)
  .populate('bakedGoods')
  .then( bakery => res.json(bakery))
  .catch(err => next(createError(404, err.message)));
});

bakeryRouter.put('/api/bakery/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/bakery/:id');

  if (Object.keys(req.body).length === 0) return next(createError(400, 'Bad Request'));

  Bakery.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( bakery => res.json(bakery))
  .catch( err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

bakeryRouter.delete('/api/bakery/:id', function(req, res, next) {
  debug('DELETE: /api/bakery');

  Bakery.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
