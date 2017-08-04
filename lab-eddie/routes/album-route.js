'use strict';

const Router = reuqire('express').Router;
const debug = require('debug')('band:album-route');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Album = require('../model/album.js');
const Band = require('../model/band.js');
const albumRouter = module.exports = new Router();

albumRouter.post('/api/band/:id/album', jsonParser, function(req, res, next){
  debug('PUT //api/band/:id/album');

  Band.findByIdAndAddAlbum(req.params.id, req.body)
  .then(album => res.json(album))
  .catch(err => next(createError(400, err.message)));
});

albumRouter.get('/api/band/:id/album/:albumId', function(req, res, next){
  debug('GET: /api/band/:id/album/:albumId');

  Album.findById(req.params.albumId)
  .then(album => res.json(album))
  .catch(err => next(createError(404, err.messgae)));
});

albumRouter.put('/api/band/:id/album/:albumId', jsonParser, function(req, res, next){
  debug('PUT: /api/band/:id/album/:albumId');

  Album.findByIdAndUpdate(req.params.albumId, req.body)
  .then(album => res.json(album))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

albumRouter.delete('/api/band/:id/album/:albumId', function(req, res, next){
  debug('DELETE: /api/band/:id/album/:albumId');

  Album.findByIdAndRemove(req.params.albumId)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
})
