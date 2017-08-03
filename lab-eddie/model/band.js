'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require(debug)('band:band');

const bandSchema = Schema({
  name: {type: String, required: true},
  genre: {type: String, required: true},
  homeTown: {type: String, required: true},
  albums: [{type: Schema.Types.ObjectId, ref: 'album'}]
});


module.exports = mongoose.model('band', bandSchema);