
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightSchema = new Schema({
  destination :  { type: String, required: true },
  flightNumber : { type: String, required: true },
  airportID : { type: Schema.Types.ObjectId, required: true }
})

module.exports = mongoose.model('Flight', flightSchema);