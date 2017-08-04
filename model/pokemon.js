'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('pokemon:pokemon');
const createError = require('http-errors');
const Pokemon = require('./pokemon.js');

const pokemonSchema = Schema({
  name: {type: String, required: true},
  origin: {type: String, required: true},
  pokemons: [{type: Schema.Types.ObjectId, ref: 'pokemon'}]
});

const Pokemon = module.exports = mongoose.model('pokemon', pokemonSchema);

Pokemon.findByIdAndAddPokemon = function(id, pokemon) {
  debug('findByIdAndAddPokemon');

  return Pokemon.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(pokemon => {
    pokemon.pokemonID = pokemon._id;
    this.tempPokemon = pokemon;
    return new Pokemon(pokemon).save();
  })
  .then(pokemon => {
    this.tempPokemon.pokemons.push(pokemon._id);
    this.tempPokemon = pokemon;
    return this.tempPokemon.save();
  })
  .then(() => {
    return this.tempPokemon;
  });
};