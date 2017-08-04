'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('superhero:server');

const cUniverseRouter = require('./route/cUniverse-route.js');
const superheroRouter = require('./route/superhero-route.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/cUniverseofsuperheros';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(cUniverseRouter);
app.use(superheroRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`listening on ${PORT}`);
});
