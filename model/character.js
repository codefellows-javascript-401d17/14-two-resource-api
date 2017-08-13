'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const charSchema = Schema({
  name: { type: String, required: true },
  houseID: { type: Schema.Types.ObjectId, required: true }
});

const Character = module.exports = mongoose.model('character', charSchema);
