'use strict';

const createError = require('http-errors');
const debug = require('debug')('book:error-middleware');

module.exports = function(error, request, response, next) {
  debug('error middleware');
  
  if (error.status) {
    response.status(error.status).send(error.message)
    next();
    return;
  }

  if (error.name === 'ValidationError') {
    error = createError(400, error.message);
    response.status(error.status).send(error.message);
    next(error);
    return;
  }

  error = createError(500, error.message);
  response.status(error.status).send(error.message);
  next();
}