# Two Resource API - Lab 14

### Description:

This app is an API that utilizes the express framework. Following REST architecture the this app allows a resource to be READ, CREATED, UPDATED and DELETED. It runs the appropriate tests for getting the correct data and error messages.

### Resources:

#### Band
* Required properties: name and origin
* Has an array where Songs can be referenced

#### Song
* Required properties: name and year
* Has its own ID as well as a Band ID that maps back to the Band resource its stored in

### How to use:

* Run the server from the command line using `npm run start`
* Open a separate tab in the terminal
* From the second tab start by entering `http [optional request method] :8000/api/band/`
to get all the ids of the songs in local storage
* `GET` or READ requests do not require a request method in the command line
  * followed by the songs items id like `/[unique-band-id]'`
* `POST` or CREATE requests are made with `POST` as the request method
  * followed by a space then key-value pairs like `name=[item-name]` (no space after parenthesis)
  * all key-value pairs must have a space between them
* `DELETE` requests are made like `GET` only with the `DELETE` as the request method
* `PUT` or UPDATE requests are made by entering the `/[id]` followed by a space key value pairs like the `POST` request
