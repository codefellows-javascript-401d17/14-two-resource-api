'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('band:band-route');
const createError = require('http-errors');

const Band = require('../model/band.js');
const bandRouter = module.exports = new Router();

bandRouter.post('/api/band', jsonParser, function(req, res, next) {
  debug('POST: /api/band');
  console.log('Works right here');
  
  new Band(req.body).save()
  .then( band => res.json(band))
  .catch(err => next(createError(400, err.message)));
});

bandRouter.get('api/band/:id', function(req, res, next) {
  debug('GET: /api/band/:id');

  Band.findById(req.params.id)
  .populate('albums')
  .then(band => res.json(band))
  .catch(err => next(createError(404, err.message)));
});

bandRouter.put('api/band/:id', jsonParser, function(req, res, next){
  debug('PUT: /band/api/:id');

  Band.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(band => res.json(band))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  })

});

bandRouter.delete('api/band/:id', function(req, res, err){
  debug('DELETE: api/band/:id');

  Band.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});