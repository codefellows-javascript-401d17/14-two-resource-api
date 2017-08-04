'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('car:server');

const dealerRouter = require('./route/dealer-route.js');
const carRouter = require('./route/car-route.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/dealerofcars';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(dealerRouter);
app.use(carRouter);
app.use(errors);

app.listen(PORT, () => {
    debug(`LISTENING ON ${PORT}`);
});