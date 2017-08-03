'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const charSchema = Schema({
  name: { type: String, required: true },
  houseID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('char', charSchema);
