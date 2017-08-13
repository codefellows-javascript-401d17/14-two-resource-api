'use strict';

const createError = require('http-errors');
const debug = require('debug')('got:error-middleware');

module.exports = function(err, request, response, next) {
  debug('error middleware');

  console.error('msg:', err.message);
  console.error('name:', err.name);

  if(err.status) {
    response.status(err.status).send(err.name);
    next();
    return;
  }

  if(err.name === 'ValidatonError') {
    err = createError(400, err.message);
    response.status(err.status).send(err.name);
    next();
    return;
  }

  err = createError(500, err.message);
  response.status(err.status).send(err.name);
  next();
  return;
}
