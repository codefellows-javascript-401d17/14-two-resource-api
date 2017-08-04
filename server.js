'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('pokemon:server');

const pokemonRouter = require('./route/pokemon-route.js');
const typeRouter = require('./route/type-route.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/pokemonlist';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(pokemonRouter);
app.use(typeRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`listening on ${PORT}`);
});