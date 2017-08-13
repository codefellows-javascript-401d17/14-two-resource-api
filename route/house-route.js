'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('got:house-route');
const createError = require('http-errors');
const House = require('../model/house.js');
const houseRouter = module.exports = new Router();

houseRouter.post('/api/house', jsonParser, function(request, response, next) {
  debug('POST: /api/house/');

  request.body.timestamp = new Date();
  new House(request.body).save()
  .then( house => response.json(house))
  .catch(err => next(createError(404, err.message)));
});

houseRouter.get('/api/house/', function(request, response, next) {
  debug('GET: /api/house/');

  House.find({})
  .then(houses => response.json(houses))
  .catch(err => next(createError(404, err.message)));
});

houseRouter.get('/api/house/:id', function(request, response, next) {
  debug('GET: /api/house/:id');

  House.findById(request.params.id)
  .populate('characters')
  .then( house => response.json(house))
  .catch(err => next(createError(404, err.message)));
});

houseRouter.put('/api/house/:id', function(request, response, next) {
  debug('PUT: /api/house/:id');

  House.findByIdAndUpdate(request.params.id, request.body, { new: true })
  .then(house => response.json(house))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

houseRouter.delete('/api/house/:id', function(request, response, next) {
  debug('DELETE: /api/house/:id');

  House.findByIdAndRemove(request.params.id)
  .then(() => response.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
