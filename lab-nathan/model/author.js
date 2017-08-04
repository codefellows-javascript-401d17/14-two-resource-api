'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('book:author');
const createError = require('http-errors');
const Book = require('./book.js');

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const authorSchema = Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  books: [{ type: Schema.Types.ObjectId, ref: 'book' }]
});

authorSchema.methods.addBook = function(book) {
  debug('addBook');
  if (!(book instanceof Book)) return Promise.reject('Parameter \'book\' must be an instance of Book.');
  book.authorId = this._id;
  this.books.push(book);
  return this.save()
    .then(() => book.save());
}

module.exports = mongoose.model('author', authorSchema);