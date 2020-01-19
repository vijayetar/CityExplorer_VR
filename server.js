'use strict';
// require the libraries
const express = require('express'); 
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const superagent = require('superagent');
const cors = require('cors');
app.use(cors());  
const client = require('./lib/global/client');

///////////////////////////LIBRARIES /////////////////////////////////////
//global
const constructNewArray = require('./lib/global/constructorArray function');
const errorHandler = require('./lib/global/errorhandler');

//constructors
const Trails = require('./lib/trails/trails_Trails_constructor');

//handlers

const locationHandler = require('./lib/locations/location_handler');

const weatherHandler = require('./lib/weather/weather_weatherHandler');

const eventHandler = require('./lib/events/events_eventHandler');

const moviesHandler = require('./lib/movies/movies_moviesHandler');

const yelpHandler = require('./lib/yelp/yelp_yelpHandler');

/////////////////////////////////////ROUTES/////////////////////////
app.get('/location',locationHandler);
app.get('/weather', weatherHandler);
app.get('/events', eventHandler);
app.get('/movies', moviesHandler);
app.get('/yelp', yelpHandler);
app.get('/trails', trailHandler);

app.use('*', nonFoundHandler);
app.use(errorHandler);

///////////////////////////HANDLER FUNCTIONS//////////////////////////////


function trailHandler (request, response) {
  console.log('trying the trail handler');
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let trailapi_key = process.env.TRAIL_API_KEY;
  let trail_url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${trailapi_key}`;
  superagent.get(trail_url)
  .then(trailresults => {
    let trailResultsArray = trailresults.body.trails;
    const trailsArray = constructNewArray (trailResultsArray, Trails);
    response.status(200).json(trailsArray);
  })
  .catch(() => errorHandler('So sorry, the trail handler did not work', request, response));
}

//////////////////////////ERROR HANDLER //////////////////////////////////

function nonFoundHandler(request, response) {response.status(404).send('this route does not exist')
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