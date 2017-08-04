'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const Album = require('./album.js')
const debug = require(debug)('band:band');

const bandSchema = Schema({
  name: {type: String, required: true},
  genre: {type: String, required: true},
  homeTown: {type: String, required: true},
  albums: [{type: Schema.Types.ObjectId, ref: 'album'}]
});

const Band = module.exports = mongoose.model('band', bandSchema);

Band.findByIdAndAddAlbum = function(id, album) {
  debug('findByIdAndAddAlbum');

  return Band.findById(id)
  .catch(err => Promise.rejecy(createError(400, err.message)))
  .then(band => {
    album.bandID = band._id;
    this.tempBand = band;
    return new Album(album).save();
  })
  .then(album => {
    this.tempBand.albums.push(album._id);
    this.tempAlbum = album;
  })
  .then(() => this.tempAlbum);

}