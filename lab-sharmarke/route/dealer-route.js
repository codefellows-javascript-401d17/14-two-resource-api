'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Dealer = require('../model/dealer.js');
const dealerRouter = module.exports = new Router();
const debug = require('debug')('car:dealer-route');
const createError = require('http-errors');

dealerRouter.post('/api/dealer', jsonParser, function(req, res, next) {
    debug('PUT: /api/dealer');

    req.body.timestamp = new Date();
    new Dealer(req.body).save()
    .then( dealer => res.json(json))
    .catch(next);
});

dealerRouter.get('api/dealer/:id', function(req, res, next) {
    debug('GET: /api/dealer');

    Dealer.findById(res.params.id)
    .populate('cars')
    .then( car => res.json(car))
    .catch(next);
});

dealerRouter.put('/api/dealer/:id', jsonParser, function(req, res, next) {
    debug('PUT: /api/dealer/:id');

    Dealer.findByIdAndUpdate(req.params.id, req.body, { new: true})
    .then( dealer => res.json(dealer))
    .catch( err => {
        if (err.name === 'ValidationError') return next(err);
        next(createError(404, err.message));
    });
});

dealerRouter.delete('/api/dealer/:id', function(req, res, next) {
    debug('DELETE: /api/dealer/:id');

    Dealer.findByIdAndRemove(req.params.id)
    .then(  () => res.status(204.).send())
    .catch( err => next(createError(404, err.message)));
});