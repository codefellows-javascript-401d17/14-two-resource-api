'use strict';

const Router = require('express').Router;
const Book = require('../model/book.js');
const Author = require('../model/author.js');
const debug = require('debug')('books:book-route');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const bookRouter = new Router();

bookRouter.post('/api/author/:authorId/book', jsonParser, function(request, response, next) {
  debug('POST: /api/author/:authorId/book');

  if (!Object.keys(request.body).length) {
    return next(createError(400, 'Book not provided.'));;
  }

  Author.findById(request.params.authorId)
    .then(author => {
      return Book.create({
        title: request.body.title,
        date: request.body.date,
        authorId: author._id
      })
        .then(book => {
          response.json(book);
          return author.addBook(book);;
        })
        .catch(error => {
          next(error);
        });
    })
    .catch(error => {
      next(createError(404, error.message));
    });
});

bookRouter.get('/api/author/:authorId/book', function(request, response, next) {
  debug('GET: /api/author/:authorId/book');

  Book.find({ authorId: request.params.authorId })
    .then(books => {
      response.json(books);
    })
    .catch(error => next(error));
});

bookRouter.get('/api/author/:authorId/book/:id', function(request, response, next) {
  debug('GET: /api/author/:authorId/book/:id');

  Book.findById(request.params.id)
    .then(book => {
      response.json(book);
      next();
    })
    .catch(error => next(createError(404, 'Book not found.')));
});


bookRouter.put('/api/author/:authorId/book/:id', jsonParser, function(request, response, next) {
  debug('PUT: /api/author/:authorId/book/:id');

  Book.findByIdAndUpdate(request.params.id, request.body, { new: true } )
    .then(book => {
      response.json(book)
      next();
    })
    .catch(error => next(createError(404, 'Book not found.')));
});

bookRouter.delete('/api/author/:authorId/book/:id', function(request, response, next) {
  debug('DELETE: /api/author/:authorId/book/:id');

  Book.findByIdAndRemove(request.params.id)
    .then(() => {
      response.sendStatus(204);
      next();
    })
    .catch(error => next(createError(404, 'Book not found.')));
});

module.exports = bookRouter;