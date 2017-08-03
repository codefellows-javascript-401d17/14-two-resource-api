'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('char:house');
const createError = require('http-errors');
const Char = require('./char.js');

const houseSchema = Schema({
  familyName: { type: String, required: true },
  seat: { type: String, require: true },
  region: { type: String, require: true },
  words: { type: String, require: true },
  characters: [{ type: Schema.Types.ObjectId, ref: 'char'}]
});

const House = module.exports = mongoose.model('house', houseSchema);

House.findByIdAndAddChar = function(id, char) {
  debug('findByIdAndAddChar');

  return House.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(house => {
    char.houseID = house._id;
    this.tempHouse = house;
    return new Char(char).save();
  })
  .then(char => {
    this.tempHouse.characters.push(char._id);
    this.tempChar = char;
    return this.tempHouse.save();
  })
  .then(() => {
    return this.tempChar;
  });
};
