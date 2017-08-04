'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeSchema = Schema({
  name: {type: String, required: true},
  origin: {type: String, required: true},
  types: {type: Schema.Types.ObjectId, required: true}
});

module.exports = mongoose.model('type', typeSchema);
