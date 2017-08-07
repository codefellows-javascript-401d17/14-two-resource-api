'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('pokemon:trainer');
const createError = require('http-errors');
const Pokemon = require('./pokemon.js');

const trainerSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  pokemons: [{type: Schema.Types.ObjectId, ref: 'pokemon'}]
});

const Trainer = module.exports = mongoose.model('trainer', trainerSchema);

Trainer.findByIdAndAddPokemon = function(id, pokemon) {
  debug('findByIdAndNote');

  return Trainer.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(trainer => {
    trainer.trainerID = trainer._id;
    this.tempTrainer = trainer;
    return new Pokemon(pokemon).save();
  })
  .then(pokemon => {
    this.tempTrainer.pokemon.push(pokemon._id);
    this.tempPokemon = pokemon;
    return this.tempTrainer.save();
  })
  .then(() => {
    return this.tempPokemon;
  });
};