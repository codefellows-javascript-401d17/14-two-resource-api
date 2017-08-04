'use strict';

const
expect = require('chai').expect,
request = require('superagent'),
Dealer = require('../model/dealer.js'),
Car = require('../model/car.js'),

PORT = process.env.PORT || 3000;

require('../server.js');

const url = `http:localhost:${PORT}`;

const exampleCar = {
    name: 'test name',
    content: 'test car content'
}

const exampleDealer = {
    name: 'example dealer',
    timestamp: new Date()
}

describe('Car Routes', function() {
    describe('POST: /api/dealer/:dealerID/car', function() {
        describe('with a valid dealer id and car body', () => {
            before( done => {
                new Dealer(exampleDealer).save()
                .then( dealer => {
                    this.tempDealer = dealer;
                    done();
                })
                .catch(done);
            });

            after( done => {
                Promise.all([
                    Dealer.remove({}),
                    Car.remove({})
                ])
                .then( () => done())
                .catch(done);
            });

            it('should return a car', done => {
                request.post(`${url}/api/dealer/${this.tempDealer._id}/car`)
                .send(exampleCar)
                .end((err, res) => {
                    if (err) return done (err);
                    expect(res.body.name).to.equal(exampleCar.name);
                    expect(res.body.dealerID).to.equal(this.tempDealer._id.toString())
                    done();
                });
            });
        });
    });
});