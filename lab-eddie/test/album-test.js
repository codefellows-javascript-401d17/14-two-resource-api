'use strict';

const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;

const Band = require('../model/band.js');
const Album = require('../model/album.js');
const PORT = process.env.PORT || 3000;
const url = `localhost:${PORT}/api`;

mongoose.Promise = Promise;
require('../sever.js');

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