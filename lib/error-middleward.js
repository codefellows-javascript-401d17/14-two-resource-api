'use strict';

const createError = require('http-errors');
const debug = require('debug')('Brewery:error-middleware');

module.exports = function(err, req, res, next) {
  debug('error-middleware-handlers');
  console.error(err.name);
  console.error(err.message);

  if()
}
