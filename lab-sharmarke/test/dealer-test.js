'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Dealer = require('../model/dealer.js');
const PORT = process.env.PORT || 3000;
const Car = require('../model/car.js');
const mongoose = require('mongoose');

// process.env.MONGODB_URI = 'mongodb://localhost/listofnotes';

mongoose.Promise = Promise;
require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleDealer = {
    name: 'test dealer name',
    timestamp: new Date
}

const exampleCar = {
    name: 'example car name',
    content: 'example content'
}

describe('Dealer Routes', function() {
    describe('POST: /api/car', function() {
        describe('with a valid req body', function(){
            after( done => {
                if (this.tempDealer) {
                    Dealer.remove({})
                    .then( () => done())
                    .catch(done);
                    return;
                }
                done();
            });

            if('should return a dealer', done => {
                request.post(`${url}/api/dealer`)
                .send(exampleDealer)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.name).to.equal('test dealer name');
                    this.tempDealer = res.body;
                    done();
                });
            });
        });
    });

    // describe('GET: /api/dealer/:id')
}); 