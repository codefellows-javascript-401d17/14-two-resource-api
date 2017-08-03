'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('brewery:brewerySchema');
const Beer = require('./beer.js');

const brewerySchema = Schema ({
  name: {type: String, required: true},
  address: {type: String, required: true},
  phoneNumber: {type: String, required: true},
  timestamp: {type: Date, required: true},
  beers: [{type: Schema.Types.ObjectId, ref: 'beer'}]
});

const Brewery = module.exports = mongoose.model('beer', beerSchema);

Brewery.findByIdAndAddBeer = function(id, beer){
  debug('findByIdAndAddBeer');

  return Brewery.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( brewery => {
    beer.breweryID = breweryID;
    this.tempBrewery = brewery;
    return new Beer(beer).save();
  })
  .then( beer => {
    this.tempBrewery.beers.push(beer_id);
    this.tempBrewery = beer;
    return this.tempList.save();
  })
  .then( () => {
    return this.tempBeer;
  });
};
