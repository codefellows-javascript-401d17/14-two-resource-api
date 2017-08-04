'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actorSchema = Schema({
  name: {type: String, required:true},
  age: {type: Number, required:true},
  movieID: {type: Schema.Types.ObjectId, required:true}
});

module.exports = mongoose.model('actor', actorSchema);
