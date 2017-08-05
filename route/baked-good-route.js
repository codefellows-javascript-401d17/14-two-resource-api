'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('bakedGood:baked-good-router');
const Bakery = require('../model/bakery.js');
const BakedGood = require('../model/bakedgood.js');

const bakedGoodRouter = module.exports = new Router();

bakedGoodRouter.post('/api/bakery/:bakeryID/bakedgood', jsonParser, function(req, res, next) {
  debug('POST: /api/bakery/:bakeryID/bakedgood');

  Bakery.findByIdAndAddBakedGood(req.params.bakeryID, req.body)
  .then( bakedGood => res.json(bakedGood))
  .catch(next);
});

bakedGoodRouter.get('/api/bakedgood/:bakedgoodID', function(req, res, next) {
  debug('GET: /api/bakedgood/:bakedgoodID');

  BakedGood.findById(req.params.bakedgoodID)
  .then( bakedGood => res.json(bakedGood))
  .catch(next);
});