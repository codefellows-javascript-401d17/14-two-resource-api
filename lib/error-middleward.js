'use strict';

const createError = require('http-errors');
const debug = require('debug')('Brewery:error-middleware');

module.exports = function(err, req, res, next) {
  debug('error-middleware-handlers');
  console.error(err.name);
  console.error(err.message);

  if(err.name === 'CastError' ){
    err = createError(404, err.message);
    next();
    return;
  }

  if(err.name === 'ValidationError'){
    err = createError(400, err.message);
    next();
    return;
  }

  if(err.status){
    debug('user error');
    res.status(err.status).send(err.message);
    return;
  }

  debug('server error');
  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};
