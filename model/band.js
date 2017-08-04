'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('song:band');
const createError = require('http-errors');
const Song = require('./song.js');

const bandSchema = Schema({
  name: { type: String, required: true },
  origin: { type: String, required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'song'}]
});

const Band = module.exports = mongoose.model('band', bandSchema);

Band.findByIdAndAddSong = function(id, song) {
  debug('findByIdAndAddSong');

  return Band.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(band => {
    song.bandID = band._id;
    this.tempBand = band;
    return new Song(song).save();
  })
  .then(song => {
    this.tempBand.songs.push(song._id);
    this.tempSong = song;
    return this.tempBand.save();
  })
  .then( () => {
    return this.tempSong;
  });
};
