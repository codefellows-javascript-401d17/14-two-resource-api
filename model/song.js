'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  bandID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('song', songSchema);
