'use strict';
const jsonParser = require('body-parser').json();
const Airport = require('../model/airport.js');
const Router = require('express').Router;
const flightRouter = module.exports = new Router();

flightRouter.post('/api/airport/:airportID/flight', jsonParser, function (req, rsp, next) {
  Airport.findByIdAndAdd(req.params.airportID, req.body)
    .then((flight) => {
      return rsp.json(flight);
    })
    .catch(next);
});

flightRouter.get('/api/airport/:airportID/flight', function (req, rsp, next) {
  Airport.findById(req.params.airportID)
    .populate('flight')
    .exec(function (err, something) {
      if (err) console.log(err);
      console.log('****************', something);
    })
});

flightRouter.put('/api/airport/:airportID/flight/:flightID', jsonParser, function (req, rsp, next) {
  Airport.findByIdAndUpdate(req.params.airportID, req.body)
    .then((flight) => {
      return rsp.json(flight);
    })
    .catch(next);
})

flightRouter.delete('/api/airport/:airportID/flight/:flightID', function (req, rsp, next) {
  console.log('PARAMS *** PARAMS *** PARAMS', req.params);
  Airport.findByIdAndRemove(req.params.airportID, req.params.flightID)
    .then(() => {
      rsp.sendStatus(204);
    })
    .catch(err => {
      // console.log(err)
    })
});