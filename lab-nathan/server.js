'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const debug = require('debug')('book:server');

const authorRouter = require('./route/author-router.js');
const bookRouter = require('./route/book-router.js');
const errors = require('./lib/error-middleware.js');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(authorRouter);
app.use(bookRouter);
app.use(errors);

app.listen(PORT, function() {
  debug(`Listening on port ${PORT}.`);
});