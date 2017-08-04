'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('car:dealer');
const createError = require('http-errors');
const Car = require('./car.js');

const dealerSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  cars: [{ type: Schema.Types.ObjectId, ref: 'car'}]
});

const Dealer = module.exports = mongoose.model('dealer', dealerSchema);

Dealer.findByIdAndAddCar = function(id, note) {
  debug('findByIdAndAddCar');

  return Dealer.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( dealer => {
    car.dealerID = dealer._id;
    this.tempDealer = dealer;
    return new Car(car).save();
  })
  .then( car => {
    this.tempDealer.cars.push(car._id);
    this.tempCar = car;
    return this.tempDealer.save();
  })
  .then ( () => {
    return this.tempCar;
  });
};
