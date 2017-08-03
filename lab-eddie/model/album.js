'use strict';

const mongoose = require('mongoose');
const Scheme = mongoose.Schema;
const debug = require('debug')('band:album');

const albumSchema = Schema({
  title: {type: String, required: true},
  genre: {type: String, required: true},
  datePublished: {type: Date, required: true},
  tracks: [{type: Scheme.Types.ObjectId, ref: 'song'}]
});

module.exports = mongoose.model('album', albumSchema);