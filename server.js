'use strict';
// require the libraries
const express = require('express'); 
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const superagent = require('superagent');
const cors = require('cors');
app.use(cors());  

///////////////////////////LIBRARIES /////////////////////////////////////
//global
const client = require('./lib/global/client');
const constructNewArray = require('./lib/global/constructorArray function');
const errorHandler = require('./lib/global/errorhandler');

//constructors
const MoviesInfo = require('./lib/movies/movies_MoviesInfo_constructor');
const YelpReviews = require('./lib/yelp/yelp_YelpReviews_constructor');
const Trails = require('./lib/trails/trails_Trails_constructor');

//handlers

const locationHandler = require('./lib/locations/location_handler');

const weatherHandler = require('./lib/weather/weather_weatherHandler');

const eventHandler = require('./lib/events/events_eventHandler');

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

function moviesHandler(request,response){
  let city = request.query.search_query;
  let moviesdb_key = process.env.MOVIE_API_KEY;
  let movies_url = `https://api.themoviedb.org/3/search/movie?api_key=${moviesdb_key}&language=en-US&query=${city}`;
  superagent.get(movies_url)
    .then (allmovieresults => {
      // console.log('these are movie results in the body', allmovieresults.body);
      let movieresults = allmovieresults.body.results;
      const movieresultsArray = constructNewArray (movieresults, MoviesInfo);
      response.status(200).json(movieresultsArray);
    })
    .catch(() => errorHandler ('So sorry, the movie handler is not working', request, response));
}

function yelpHandler (request, response) {
  let city = request.query.search_query;
  let yelpapi_key = process.env.YELP_API_KEY;
  const yelp_url = `https://api.yelp.com/v3/businesses/search?restaurant&location=${city}}`;

  superagent.get(yelp_url)
  .set({'Authorization': `Bearer ${yelpapi_key}`})
  .then(yelpresults => {
    let yelpparsedresults = JSON.parse(yelpresults.text);
    let yelpparsedresultArray = yelpparsedresults.businesses;
    const yelpreviewsArray = constructNewArray (yelpparsedresultArray, YelpReviews);
    response.status(200).json(yelpreviewsArray);
  })
  .catch(() => errorHandler ('So sorry, the yelp handler is not working', request, response));
}


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