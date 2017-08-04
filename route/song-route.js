'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('song:song-route');
const createError = require('http-errors');
const Band = require('../model/band.js');
const Song = require('../model/song.js');

const songRouter = module.exports = new Router();

songRouter.post('/api/band/:bandID/song', jsonParser, function(req, res, next) {
  debug('POST: /api/band/:bandID/song');

  Band.findByIdAndAddSong(req.params.bandID, req.body)
   .then(song => res.json(song))
   .catch(next);
});

songRouter.get('/api/band/:bandID/song/:id', function(req, res, next) {
  debug('GET: /api/band/:bandID/song/:id');

  Song.findById(req.params.id)
  .then(song => res.json(song))
  .catch(err => next(createError(404, err.message)));
});

songRouter.put('/api/band/:bandID/song/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/band/:bandID/song/:id');

  if(!req.body.name) return next(createError(400, res.message));

  Song.findByIdAndUpdate(req.params.id, req.body, { 'new': true })
  .then(song => res.json(song))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

songRouter.delete('/api/band/:bandID/song/:id', function(req, res, next) {
  debug('DELETE: /api/band/:bandID/song/:id');

  Song.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
