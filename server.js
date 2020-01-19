'use strict';
///////////////////////////LIBRARIES /////////////////////////////////////

const express = require('express'); 
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors());  
const client = require('./lib/global/client');

//global
const errorHandler = require('./lib/global/errorhandler');

//handlers

const locationHandler = require('./lib/locations/location_handler');

const weatherHandler = require('./lib/weather/weather_weatherHandler');

const eventHandler = require('./lib/events/events_eventHandler');

const moviesHandler = require('./lib/movies/movies_moviesHandler');

const yelpHandler = require('./lib/yelp/yelp_yelpHandler');

const trailHandler = require('./lib/trails/trails_trailHandler');

/////////////////////////////////////ROUTES/////////////////////////
app.get('/location',locationHandler);
app.get('/weather', weatherHandler);
app.get('/events', eventHandler);
app.get('/movies', moviesHandler);
app.get('/yelp', yelpHandler);
app.get('/trails', trailHandler);

app.use('*', nonFoundHandler);
app.use(errorHandler);


//////////////////////////ERROR HANDLER //////////////////////////////////

function nonFoundHandler() {response.status(404).send('this route does not exist')
};

//////////// Connect to DB and Start the Web Server
client.connect()
  .then( () => {
    app.listen(PORT, () => {
      console.log(`app is up and running on city explorer: ${PORT}`);
    });
  })
  .catch(error => {
    throw `PG Startup Error: ${error.message}`;
  })