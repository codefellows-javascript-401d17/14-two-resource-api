'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const House = require('../model/house.js');
const Character = require('../model/character.js');

const charRouter = new Router();

charRouter.post('/api/house/:houseID/character', jsonParser, function(request, response, next) {
  House.findByIdAndAddCharacter(request.params.houseID, request.body)
  .then(character => response.json(character))
  .catch(next);
});
