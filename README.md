## James Lab-13 Documentation

  * server.js uses the environmental port (3000) and defines the connection to the database using MongooseJS, sets up the server using Express, and requires route/brewery-router.js, which defines all routes for the single-resource API.
  * model/brewery.js defines the brewery constructor.
  * The following methods will return the following results:
    * GET localhost:3000/api/brewery/xxxxxxxxxxxxxxxxxxxxxxxx (:id) - returns status code 200 and a brewery object matching a valid ID.
    * POST localhost:3000/api/brewery - returns a 400 error code and the details of the error.
    * POST localhost:3000/api/brewery name=<NAME> grain=<GRAIN> hops=<HOPS> yeast=<YEAST> - returns status code 201 and a new breweryobject for a POST request with a valid body.
    * PUT localhost:3000/api/brewery - returns a 404 error code and the details of the error if a valid ID is not included.
    * PUT localhost:3000/api/brewery/xxxxxxxxxxxxxxxxxxxxxxxx name: <NAME>,
    address: <ADDRESS>, phoneNumber: <PHONENUMBER>, - returns status code 200 an updated brewery object for PUT request with valid ID and ANY NUMBER of parameters that should be changed, for instance, 'PUT localhost:3000/api/brewery/xxxxxxxxxxxxxxxxxxxxxxxx name=<NAME>'.
    * DELETE localhost:3000/api/brewery?id=1 - returns 404 error code and and the details of the error for valid DELETE request made with an ID that was not found.
    * DELETE localhost:3000/api/brewery/xxxxxxxxxxxxxxxxxxxxxxxx - returns  204 status code for a DELETE request with a valid ID.
