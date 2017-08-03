'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bandSchema = Schema({
  name: { type: String, required: true },
  origin: { type: String, required: true }
});

module.exports = mongoose.model('band', bandSchema);
