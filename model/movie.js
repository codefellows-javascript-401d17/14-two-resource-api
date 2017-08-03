'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = Schema({
  name: {type: String, required:true},
  dateReleased: { type: Date, required: true}
});

module.exports = mongoose.model('movie', movieSchema);
