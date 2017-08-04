'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/books';

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);

require('../server.js');

const url = `http://localhost:${PORT}`;

describe('Generic Endpoints', function() {
  it('should return \'bad request\' if route not found.', function(done) {
    request.get(`${url}/api/ponies`, function(error, response) {
      expect(response.status).to.equal(404);
      done();
    });
  });
});
