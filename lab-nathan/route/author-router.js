'use strict';

const Router = require('express').Router;
const Author = require('../model/author.js');
const debug = require('debug')('books:author-route');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const authorRouter = new Router();

authorRouter.post('/api/author', jsonParser, function(request, response, next) {
  debug('POST: /api/author');

  if (!Object.keys(request.body).length) {
    return next(createError(400, 'Author not provided.'));;
  }

  Author.create(request.body)
    .then(author => {
      response.json(author);
      next();
    })
    .catch(error => next(createError(400, error.message)));
});

authorRouter.get('/api/author', function(request, response, next) {
  debug('GET: /api/author');

  Author.find({})
    .then(authors => {
      response.json(authors);
    })
    .catch(error => next(error));
});

authorRouter.get('/api/author/:id', function(request, response, next) {
  debug('GET: /api/author');

  Author.findById(request.params.id)
    .populate('books')
    .then(author => {
      response.json(author);
      next();
    })
    .catch(error => next(createError(404, 'Author not found.')));
});

authorRouter.put('/api/author/:id', jsonParser, function(request, response, next) {
  debug('PUT: /api/author');

  Author.findByIdAndUpdate(request.params.id, request.body, { new: true } )
    .then(author => {
      response.json(author)
      next();
    })
    .catch(error => next(createError(404, 'Author not found.')));
});

authorRouter.delete('/api/author/:id', function(request, response, next) {
  debug('DELETE: /api/author');

  Author.findByIdAndRemove(request.params.id)
    .then(() => {
      response.sendStatus(204);
      next();
    })
    .catch(error => next(createError(404, 'Author not found.')));
});

module.exports = authorRouter;