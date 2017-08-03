'use strict';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('brewery:server');
const breweryRouter = require('./route/brewery-route.js');
const beerRouter = require('./route/beer-route.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODG_URI = 'mongods://localhost/brewery';

mongoose.Promise = Promise;
mongoose.connect(MONGODG_URI);

app.use(cors);
app.use(morgan('dev'));
app.use(breweryRouter);
app.use(beerRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`server on ${PORT}`);
});
