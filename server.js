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
const MapObject = require('./lib/locations/location_MapObject_constructor');
const WeatherObject = require('./lib/weather/weather_WeatherObject_constructor');
const Event = require('./lib/events/events_Event_constructor');
const MoviesInfo = require('./lib/movies/movies_MoviesInfo_constructor');
const YelpReviews = require('./lib/yelp/yelp_YelpReviews_constructor');
const Trails = require('./lib/trails/trails_Trails_constructor');

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

function locationHandler (request,response){
  let city = request.query.city;
  let sql = 'SELECT * FROM city_explorer WHERE search_query = $1;';
  let safeValues = [city];
  client.query (sql, safeValues)
    .then (results  => {
      // console.log ('this is the city:',results,'this is rows', results.rows);
      if (results.rows.length>0){
        console.log('found results in db');
        response.send(results.rows[0]);
        return;
      }
      else {
        console.log('could not find in the db going to the api');
        let locationIQ_key = process.env.LOCATION_IQ_KEY;
        let locationIQ_url = `https://us1.locationiq.com/v1/search.php?key=${locationIQ_key}&q=${city}&format=json&limit=1`;

        superagent.get (locationIQ_url)
        .then(locresults => {
          console.log("I got the newlocationHandler going");
          const geoData = locresults.body[0];
          console.log('this is the geoData', geoData);
          const mapObject = new MapObject(city, geoData);
          console.log('this is ')
          let sql2 = `INSERT INTO city_explorer (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);`;
          let safeValues = [mapObject.search_query, mapObject.formatted_query, mapObject.latitude, mapObject.longitude];
          client.query(sql2, safeValues);
          response.status(200).json(mapObject);
        })
        .catch(() => {
          errorHandler ('So sorry deeper Location handler here', request, response);
        })
      }
    })
    .catch(() => {
      errorHandler ('So sorry outside Location handler here', request, response);
    })
}

function weatherHandler(request,response){
  // get data from darksky.json
    console.log('the weather data is working');
    let latitude = request.query.latitude;
    let longitude = request.query.longitude;
    let darkSky_key = process.env.DARKSKY_API_KEY;
    let darkSky_url = `https://api.darksky.net/forecast/${darkSky_key}/${latitude},${longitude}`;
    superagent.get(darkSky_url)
      .then(weatherobj =>  {
        const weatherresponseData = weatherobj.body.daily.data;
        const weatherresponseArray = constructNewArray(weatherresponseData, WeatherObject);
        response.status(200).json(weatherresponseArray);
      })
      .catch(()  => { 
        errorHandler ('So sorry Weather handler not working', request, response)
      });
}

function eventHandler(request,response){
  console.log('running the eventful handler',request.query.search_query);
  let city = request.query.search_query;
  let eventful_key = process.env.EVENTFUL_API_KEY;
  let event_url = `http://api.eventful.com/json/events/search?keywords=music&location=${city}&app_key=${eventful_key}`;
  superagent.get(event_url)
  .then (eventfulresults => {
    let eventfulparsedresults = JSON.parse(eventfulresults.text);
    let eventfulparsedresultsArray = eventfulparsedresults.events.event;
    const eventfulresultsArray = constructNewArray( eventfulparsedresultsArray, Event);
    response.status(200).json(eventfulresultsArray);
  })
  .catch(() => {
    errorHandler ('So, sorry, the eventful Handler is not working', request, response)
  });
}

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
  // yelpclient.search(searchRequest)
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
  .catch(err => {
    throw `PG Startup Error: ${err.message}`;
  })