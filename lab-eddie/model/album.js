'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = Schema({
  title: {type: String, required: true},
  genre: {type: String, required: true},
  datePublished: {type: Date, required: true},
  bandID: {type: Schema.Types.ObjectId, required: true},
  tracks: [{type: Schema.Types.ObjectId, ref: 'song'}]
});

module.exports = mongoose.model('album', albumSchema);
