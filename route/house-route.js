'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('char:house-router');
const createError = require('http-errors');
const House = require('../model/house.js');
const houseRouter = module.exports = new Router();

houseRouter.post('/api/house', jsonParser, function(req, res, next) {
  debug('POST: /api/list');

  new House(req.body).save()
  .then(house => res.json(house))
  .catch(next);
});

houseRouter.get('/api/house/:id', function(req, res, next) {
  debug('GET: /api/house');

  House.findById(req.params.id)
  .populate('characters')
  .then(house => res.json(house))
  .catch(next);
});

houseRouter.put('/api/house/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/house/:id');

  House.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then(house => res.json(house))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

houseRouter.delete('/api/house/:id', function(req, res, next) {
  debug('DELETE: /api/house/:id');

  House.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
