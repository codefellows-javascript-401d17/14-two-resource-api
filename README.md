![cf](https://i.imgur.com/7v5ASc8.png) 13: MongoDB
======

## Installation

Run npm -i to install dependencies

## Usage

You can query "Airport" resources as shown below:

GET '/api/airport/:id' - to query a specific airport

POST '/api/airport' [name, iata, city] - to post a new airport

PUT '/api/airport/:id' [name, iata, city] - to update an airport

The API handles for errors so it should prevent a user from making too many mistakes.

## Credits

Luis Manzo

## License

MIT