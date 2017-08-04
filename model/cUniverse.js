'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('superhero:cUniverse');
const createError = require('http-errors');
const Superhero = require('./superhero.js');

const cUniverseSchema = Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
  superheroes: [{ type: Schema.Types.ObjectId, ref: 'superhero'}]
});

const CUniverse = module.exports = mongoose.model('cUniverse', cUniverseSchema);

CUniverse.findByIdAndAddSuperhero = function(id, superhero) {
  debug('findByIdAndAddSuperhero');

  return CUniverse.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( cUniverse => {
    superhero.cUniverseID = cUniverse._id;
    this.tempCUniverse = cUniverse;
    return new Superhero(superhero).save();
  })
  .then( superhero => {
    this.tempCUniverse.superheroes.push(superhero._id);
    this.tempSuperhero = superhero;
    return this.tempCUniverse.save();
  })
  .then( () => {
    return this.tempSuperhero;
  });
};
