'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('char:char-router');

const House = require('../model/house.js');
const Char = require('../model/char.js');

const charRouter = module.exports = new Router();

charRouter.post('/api/house/:houseID/char', jsonParser, function(req, res, next) {
  debug('POST: /api/house/:houseID/char');

  House.findByIdAndAddChar(req.params.houseID, req.body)
  .then(char => res.json(char))
  .catch(next);
});
