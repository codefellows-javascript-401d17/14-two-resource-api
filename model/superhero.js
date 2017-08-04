'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const superheroSchema = Schema({
  name: { type: String, required: true },
  powers: { type: String, require: true },
  cUniverseID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('superhero', superheroSchema);
