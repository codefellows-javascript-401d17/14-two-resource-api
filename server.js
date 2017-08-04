const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const debug = require('debug')('airport:server.js');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost/airports_401';
const airportRouter = require('./route/airport_route.js');
const flightRouter = require('./route/flight_route.js');
const Airport = require('./model/airport.js');
const errors = require('./lib/error-middleware.js');

app.use(cors());
app.use(morgan('dev'));
app.use(airportRouter);
app.use(flightRouter);
app.use(errors);

Airport.create({name: 'jfk'});

mongoose.connect(MONGODB_URL);

app.listen(PORT, function() {
  debug(`listening on port ${PORT}`);
})