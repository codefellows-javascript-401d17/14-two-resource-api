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

describe('Book Endpoints', function() {
  describe('POST: /api/author/:authorId/book/', function() {
    before(done => {
      Author.create(testAuthor)
        .then(author => {
          this.author = author;
          done();
        })
        .catch(error => done(error));
    });

    after(done => {
      Book.findByIdAndRemove(this.book._id)
        .then(Author.findByIdAndRemove(this.author._id))
        .then(() => done())
        .catch(error => done(error));
    });

    it('should return a book.', done => {
      request.post(`${url}/api/author/${this.author._id}/book`)
        .send(testBook)
        .end((error, response) => {
          this.book = response.body;
          expect(response.status).to.equal(200);
          expect(this.book._id).to.be.a('string');
          expect(this.book.title).to.equal(testBook.title);
          expect(this.book.date).to.equal(testBook.date);
          done();
        });
    });

    it('should return an error if posting with no body.', done => {
      request.post(`${url}/api/author/${this.author._id}/book`)
        .send()
        .end(function(error, response) {
          expect(response.status).to.equal(400);
          expect(response.text).to.equal('Book not provided.');
          done();
        });
    });

    it('should return an error if posting with no title.', done => {
      request.post(`${url}/api/author/${this.author._id}/book`)
        .send({
          date: testBook.date,
        })
        .end(function(error, response) {
          expect(response.status).to.equal(400);
          expect(response.text).to.equal('book validation failed: title: Path `title` is required.');
          done();
        });
    });
  });

  describe('GET: /api/author/:authorId/book/:id', function() {
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

    it('should return a list of books if id not provided.', done => {
      request.get(`${url}/api/author/${this.author._id}/book`, function(error, response) {
        expect(response.body).to.be.an('array');
        done();
      });
    });

    it('should return an error if id not found.', done => {
      request.get(`${url}/api/author/${this.author._id}/book/12345678`, function(error, response) {
        expect(response.status).to.equal(404);
        expect(response.text).to.equal('Book not found.');
        done();
      });
    });

    it('should return a book', done => {
      request(`${url}/api/author/${this.author._id}/book/${this.book._id}`)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.title).to.equal(testBook.title);
          expect(response.body.date).to.equal(testBook.date);
          done();
        });
    });
  });

  describe('PUT: /api/author/:authorId/book/:id', function() {
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

    it('should return a book.', done => {
      let updatedBook = {
        title: 'Macbeth',
        date: 1606,
      };

      request.put(`${url}/api/author/${this.author._id}/book/${this.book._id}`)
        .send(updatedBook)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body._id).to.be.equal(this.book._id.toString());
          expect(response.body.title).to.equal(updatedBook.title);
          expect(response.body.date).to.equal(updatedBook.date);
          done();
        });
    });
  });

  describe('DELETE: /api/book', function() {
    before(done => {
      Author.create(testAuthor)
        .then(author => {
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

    it('should delete a book.', done => {
      request.delete(`${url}/api/author/${this.book.authorId}/book/${this.book._id}`, function(error, response) {
        expect(response.status).to.equal(204);
        done();
      });
    });
  });
});
