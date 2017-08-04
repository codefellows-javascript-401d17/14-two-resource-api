# Express REST API using MongoDB

This project contains a basic REST API built on express.js featuring file-system persistance, cors, and testing. You can access the API by making an HTTP request to one of the endpoints listed below.

## Resources
The following resources are available for storage and retrieval:

Note: ids are automatically generated.

```js
Author {
  _id: '4984158af3dbcb32081b3cfd'
  firstName: 'William'
  lastName: 'Shakespeare'
  books: []
}
```

```js
Book {
  _id: '5984158af0ebcb32081b3cf4'
  title: 'Hamlet'
  date: 1599
}
```

## Author Endpoints

### GET `/api/author`
Gets an array of all Authors.

### GET `/api/author/:id`
Gets a JSON representation of a Author with the specified id.

### PUT `/api/author/:id`
Updates a Author with the specified id. The body of the request should be a serialized JSON object containing the updated property values.

### POST `/api/author`
Creates a Author object. The body of the request should be a serialized JSON object containing the Author's property values.

### DELETE `/api/author/:id`
Deletes a Author object with the specified id.

## Book Endpoints

### GET `/api/author/:authorId/book`
Gets an array of all Books.

### GET `/api/author/:authorId/book/:id`
Gets a JSON representation of a Book with the specified id.

### PUT `/api/author/:authorId/book/:id`
Updates a Book with the specified id. The body of the request should be a serialized JSON object containing the updated property values.

### POST `/api/author/:authorId/book`
Creates a Book object. The body of the request should be a serialized JSON object containing the Book's property values.

### DELETE `/api/author/:authorId/book/:id`
Deletes a Book object with the specified id.