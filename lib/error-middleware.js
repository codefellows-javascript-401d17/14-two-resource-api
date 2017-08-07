'use strict';

const createError = require('http-errors');
const debug = require('debug')('pokemon:error-middleware');

module.exports = function(err, req, res, next) {
  debug('error-middleware');

  console.error('msg:', err.message);
  console.error('name:', err.name);

  if (err.status) {
    debug('user error');

    res.status(err.status).send(err.name);
    next();
    return;
  }

  if(err.name === 'ValidationError') {
    debug('validation error');

    err= createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  debug('server error');
  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};