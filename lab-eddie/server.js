'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('band:server');
const Promise = require('bluebird');
const PORT = process.env.PORT || 3000;

const app = express();
const MONGODB_URI = 'mongodb://localhost/bands';
const error = require('./middleware/errors.js');
const bandRouter = require('./routes/band-route.js');

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {useMongoClient: true});

// app.use(cors());
// app.use(debug('dev'));
// app.use(bandRouter);
// app.use(error);

app.listen(PORT, () => {
  debug('Server active on port: ', PORT);
})