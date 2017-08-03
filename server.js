const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('note:server');

const bakeryRouter = require('./route/bakery-route.js');
const bakedGoodsRouter = require('./baked-goods-route.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/bakeries';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(bakeryRouter);
app.use(bakedGoodsRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`Server on PORT: ${PORT}`);
});