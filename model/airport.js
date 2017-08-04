const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const Flight = require('./flight.js');
//require later
const airportSchema = new Schema({
  name: { type: String, required: true },
  iata: { type: String, required: false },
  city: { type: String, required: false },
  flights: [{ type: Schema.Types.ObjectId, ref: 'flight' }]
});


const Airport = module.exports = mongoose.model('Airport', airportSchema);

Airport.findByIdAndAdd = function (airportID, flightBody) {
  return Airport.findById(airportID)
    .then((airport) => {
      flightBody.airportID = airport._id;
      this.tempAirport = airport;
      return Flight.create(flightBody);
    })
    .then((flight) => {
      this.tempAirport.flights.push(flight._id);
      Airport.create(this.tempAirport);
      return flight;
    })
}


