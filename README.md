![cf](https://i.imgur.com/7v5ASc8.png) 14: Two Resource API
======

## Installation

Run npm -i to install dependencies

## Usage

#### Airports

You can query "Airport" resources as shown below:

GET '/api/airport/:id' - to query a specific airport

POST '/api/airport' [name, iata, city] - to post a new airport

PUT '/api/airport/:id' [name, iata, city] - to update an airport

#### Flights

GET '/api/airport/:id/flight/:flight_id' - to query a specific airport

POST '/api/airport/:id/flight' [name, iata, city] - to post a flight based on airport ID.

PUT '/api/airport/:id/flight/:flight_id' [name, iata, city] - to update an flight

DELETE '/api/airport/:airport_id/flight/:flight_id [id] - to delete a flight

The API handles for errors so it should prevent a user from making too many mistakes.

## Credits

Luis Manzo

## License

MIT