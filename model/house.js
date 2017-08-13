'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('got:house');
const createError = require('http-errors');

const Character = require('./character.js');

const houseSchema = Schema({
  name: { type: String, required: true },
  seat: { type: String, required: true },
  region: { type: String, required: true },
  words: { type: String, required: true },
  timestamp: { type: Date, required: true },
  characters: [{ type: Schema.Types.ObjectId, ref: 'character' }]
});

const House = module.exports = mongoose.model('house', houseSchema);

House.findByIdAndAddCharacter = function(id, character) {
  debug('find by id and add character');

  return House.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(house => {
    character.houseID = house._id;
    this.tempHouse = house;
    return new Character(character).save();
  })
  .then(character => {
    this.tempHouse.characters.push(character._id);
    this.tempChar = character;
    return this.tempHouse.save();
  })
  .then(() => {
    return this.tempHouse;
  });
}
