'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('car:car-route');
const Dealer = require('../model/dealer.js');
const carRouter = module.exports = new Router();

carRouter.post('/api/dealer/:dealerID/car', jsonParser, function(req, res, next) {
    debug('POST: /api/dealer/:dealerID/car');

    Dealer.findByIdAndAddCar(req.params.dealerID, req.body)
    .then( car => res.json(car))
    .catch(next);
});