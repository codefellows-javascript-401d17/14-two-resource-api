'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser');
const debug = require('brewery:beer router');
const Brewery = require('../model/brewery.');

const beerRouter = module.exports = new Router();

beerRouter.post('/api/brewery/:breweryID/beer', jsonParser, function(req, res, next){
  debug('POST: /api/brewery/:breweryID/beer');

  Brewery.findByIdAndAddBeer(req.params.breweryID, req.body)
  .then( beer => res.json(beer))
  .catch(next);
});
