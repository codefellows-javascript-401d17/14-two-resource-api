'use strict';

const expect = require('chai').expect;
const request = require('superagent')
const mongoose = require('mongoose');

const Band = require('../model/band.js');
const Album = require('../model/album.js');
const PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;
const url = `http://localhost:${PORT}`;
require('../server.js')

const modelBand = {
  name: 'Led Zeppelin',
  genre: 'Rock',
  homeTown: 'London',
}

const modelAlbum = {
  title: 'Led Zeppelin IV',
  genre: 'Rock',
  datePublished: new Date('11 8 1971')
}

describe('Band Routes', function(){
  
});