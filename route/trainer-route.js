'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('pokemon:trainer-route');
const Trainer = require('../model/trainer.js');

const trainerRouter = module.exports = new Router();

trainerRouter.post('/api/pokemon', jsonParser, function(req, res, next) {
  debug('POST: /api/pokemon');

  req.body.timestamp = new Date();
  new Trainer(req.body).save()
  .then(trainer => res.json(trainer))
  .catch(next);
});

trainerRouter.get('/api/pokemon/:id', function(req, res, next) {
  debug('GET: /api/pokemon/:id');

  Trainer.findById(req.params.id)
  .populate('pokemon')
  .then(trainer => res.json(trainer))
  .catch(next);
});

trainerRouter.put('api/pokemon/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/pokemon/:id');

  if(Object.keys(req.body).length === 0) {
    Trainer.findById(req.params.id)
    .then(trainer => {
      res.status(400);
      res.json(trainer);
    })
    .catch(next);
    return;
  }

  Trainer.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(trainer => res.json(trainer))
  .catch(next);
});

trainerRouter.delete('/api/trainer/:id', function(req, res, next){
  debug('DELETE: /api/trainer/:id');

  Trainer.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch(next);
});
