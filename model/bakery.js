'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('bakedGood:bakery');
const createError = require('http-errors');
const BakedGood = require('./bakedgood.js');

const bakerySchema = Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
  bakedGoods: [{ type: Schema.Types.ObjectId, ref: 'bakedGood'}]
});

const Bakery = module.exports = mongoose.model('bakery', bakerySchema);

Bakery.findByIdAndAddBakedGood = function(id, bakedGood) {
  debug('findByIdAndAddBakedGood');

  return Bakery.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( bakery => {
    bakedGood.bakeryID = bakery._id;
    this.tempBakery = bakery;
    return new BakedGood(bakery).save();
  })
  .then( bakedGood => {
    this.tempBakery.bakedGoods.push(bakedGood._id);
    this.tempBakedGood = bakedGood;
    return this.tempBakery.save();
  })
  .then( () => {
    return this.tempBakedGood;
  });
};
