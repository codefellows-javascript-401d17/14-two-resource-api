'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Author = require('../model/author.js');
const Book = require('../model/book.js');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/books';

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);

require('../server.js');

const url = `http://localhost:${PORT}`;

const testAuthor = {
  firstName: 'test first name',
  lastName: 'test last name'
};

const testBook = {
  title: 'test title',
  date: 2017
};

describe('Author Endpoints', function() {
  describe('POST: /api/author', function() {
    after(done => {
      Author.findByIdAndRemove(this.author._id)
        .then(() => done())
        .catch(error => done(error));
    });

    it('should return an author.', done => {
      request.post(`${url}/api/author`)
        .send(testAuthor)
        .end((error, response) => {
          this.author = response.body;
          expect(response.status).to.equal(200);
          expect(this.author._id).to.be.a('string');
          expect(this.author.firstName).to.equal(testAuthor.firstName);
          expect(this.author.lastName).to.equal(testAuthor.lastName);
          done();
        });
    });

    it('should return an error if posting with no body.', done => {
      request.post(`${url}/api/author`)
        .send()
        .end(function(error, response) {
          expect(response.status).to.equal(400);
          expect(response.text).to.equal('Author not provided.');
          done();
        });
    });

    it('should return an error if posting with no firstName.', done => {
      request.post(`${url}/api/author`)
        .send({
          lastName: testAuthor.lastName,
        })
        .end(function(error, response) {
          expect(response.status).to.equal(400);
          expect(response.text).to.equal('author validation failed: firstName: Path `firstName` is required.');
          done();
        });
    });

    it('should return an error if posting with no firstName.', done => {
      request.post(`${url}/api/author`)
        .send({
          firstName: testAuthor.firstName,
        })
        .end(function(error, response) {
          expect(response.status).to.equal(400);
          expect(response.text).to.equal('author validation failed: lastName: Path `lastName` is required.');
          done();
        });
    });
  });

  describe('GET: /api/author/:authorId', function() {
    before(done => {
      Author.create(testAuthor)
        .then(author => {
          this.author = author;

          return Book.create({
            title: testBook.title,
            date: testBook.date,
            authorId: author._id
          })
          .then(book => {
            this.book = book;
            return author.addBook(book)
              .catch(error => Promise.reject(error));;
          })
          .catch(error => Promise.reject(error));
        })
        .then(() => done())
        .catch(error => done(error));
    });

    after(done => {
      Book.findByIdAndRemove(this.book._id)
        .then(Author.findByIdAndRemove(this.author._id))
        .then(() => done())
        .catch(error => done(error));
    });

    it('should return a list of authors if id not provided.', done => {
      request.get(`${url}/api/author`, function(error, response) {
        expect(response.body).to.be.an('array');
        done();
      });
    });

    it('should return an error if id not found.', done => {
      request.get(`${url}/api/author/12345678`, function(error, response) {
        expect(response.status).to.equal(404);
        expect(response.text).to.equal('Author not found.');
        done();
      });
    });

    it('should return an author', done => {
      request(`${url}/api/author/${this.author._id}`)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.firstName).to.equal(testAuthor.firstName);
          expect(response.body.lastName).to.equal(testAuthor.lastName);
          done();
        });
    });
  });

  describe('PUT: /api/author/:authorId', function() {
    before(done => {
      Author.create(testAuthor)
        .then(author => {
          this.author = author;
          return Book.create({
            title: testBook.title,
            date: testBook.date,
            authorId: author._id
          })
          .then(book => {
            this.book = book;
            return author.addBook(book)
              .catch(error => Promise.reject(error));;
          })
          .catch(error => Promise.reject(error));
        })
        .then(() => done())
        .catch(error => done(error));
    });

    after(done => {
      Book.findByIdAndRemove(this.book._id)
        .then(Author.findByIdAndRemove(this.author._id))
        .then(() => done())
        .catch(error => done(error));
    });

    it('should return an author.', done => {
      let updatedAuthor = {
        firstName: 'updated author first name',
        lastName: 'updated author last name',
      };

      request.put(`${url}/api/author/${this.author._id}`)
        .send(updatedAuthor)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body._id).to.be.equal(this.author._id.toString());
          expect(response.body.firstName).to.equal(updatedAuthor.firstName);
          expect(response.body.lastName).to.equal(updatedAuthor.lastName);
          done();
        });
    });
  });

  describe('DELETE: /api/author/:authorId', function() {
    before(done => {
      Author.create(testAuthor)
        .then(author => {
          this.author = author;
          done();
        })
        .catch(error => done(error));
    });

    it('should delete an author.', done => {
      request.delete(`${url}/api/author/${this.author._id}`, function(error, response) {
        expect(response.status).to.equal(204);
        done();
      });
    });
  });
});
