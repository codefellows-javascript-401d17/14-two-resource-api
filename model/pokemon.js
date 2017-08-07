'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokemonSchema = Schema({
  name: {type: String, required: true}, //my pokemon name
  content: {type: String, required: true}, //my pokemon content
  pokemonID: {type: Schema.Types.ObjectId, required: true} //Pokemon Object ID
});

module.exports = mongoose.model('pokemon', pokemonSchema);
