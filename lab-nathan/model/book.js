'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const bookSchema = Schema({
  title: { type: String, required: true },
  date: { type: Number, required: false },
  authorId: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('book', bookSchema);