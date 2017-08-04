'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('bakedGood:baked-good-router');
const Bakery = require('../model/bakery.js');

const bakedGoodRouter = module.exports = new Router();

bakedGoodRouter.post('/api/bakery/:bakeryID/bakedGood', jsonParser, function(req, res, next) {
  debug('POST: /api/bakery/:bakeryID/bakedGood');

  Bakery.findByIdAndAddBakedGood(req.params.bakeryID, req.body)
  .then( bakedGood => res.json(bakedGood))
  .catch(next);
});

