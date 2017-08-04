'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bakedGoodSchema = Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  calories: { type: Number, required: true },
  bakeryID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('bakedGood', bakedGoodSchema);