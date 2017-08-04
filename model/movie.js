'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('movie:movie');
const createError = require('http-errors');
const Actor = require('./actor.js');

const movieSchema = Schema({
  name: {type: String, required:true},
  dateReleased: { type: Date, required: true},
  actors: [{type: Schema.Types.ObjectId, ref: 'actor'}]
});

const Movie = module.exports = mongoose.model('movie', movieSchema);

Movie.findByIdAndAddActor = function(id, actor) {
  debug('findByIdAndAddActor');

  return Movie.findById(id)
  .catch (err => Promise.reject(createError(404, err.message)))
  .then( movie => {
    actor.movieID = movie._id;
    this.tempMovie = movie;
    return new Actor(actor).save();
  })
  .then( actor => {
    this.tempMovie.actors.push(actor._id);
    this.tempActor = actor;
    return this.tempMovie.save();
  })
  .then( ()=>{
    return this.tempActor;
  });
};
