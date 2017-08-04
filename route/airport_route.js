const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('airport:airport-router');
const Airport = require('../model/airport.js');
const airportRouter = module.exports = new Router();
const createError = require('http-errors');

airportRouter.post('/api/airport', jsonParser, function (req, rsp, next) {
  debug('POST: /api/airport');
  if (Object.keys(req.body).length === 0) { 
    return next(createError(400));
  }
  new Airport(req.body).save()
    .then(airport => rsp.json(airport))
    .catch((err) => {
      debug('error: ', err.status);
      next(createError(404));
    });
});

airportRouter.put('/api/airport/:id', jsonParser, function (req, rsp, next) {
  debug('PUT: /api/airport/:id');

  if (Object.keys(req.body).length === 0) { 
    return next(createError(400));
  }

  Airport.findByIdAndUpdate(req.params.id, req.body)
    .then((airport) => {
      return rsp.json(airport);
    })
    .catch((err) => {
      next();
    })
})

airportRouter.get('/api/airport/:id', function (req, rsp, next) {
  debug('GET: /api/airport');
  Airport.findById(req.params.id)
    .then((airport) => {
      return rsp.json(airport);
    })
    .catch((err) => {
      next();
    })
})

airportRouter.delete('/api/airport/:id', function (req, rsp, next) {
  debug('DELETE: /api/airport');
  Airport.findByIdAndRemove(req.params.id)
    .then((done) => {
      done();
    })
    .catch((err) => {
      next();
    })
})