'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require ('debug')('movie:server');
const movieRouter = require('./route/movie-route.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/actorsinmovie';

mongoose.Promise= Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(movieRouter);

app.listen(PORT, ()=> {
  debug(`listening on port ${PORT}`);
});
