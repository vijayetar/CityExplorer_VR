'use strict';
// require the libraries
const express = require('express'); 
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const superagent = require('superagent');
const cors = require('cors');
app.use(cors());  
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// let cachedLocations = {};

////////////////////LIBRARIES /////////////////////////////////////


////////////////////////// CONSTRUCTORS////////////////////////////////////

//location constructor
function MapObject (city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude= geoData.lat;
  this.longitude = geoData.lon;
}

/// weather constructor
function WeatherObject (weather) {
  this.forecast = weather.summary;
  this.time = new Date(weather.time*1000).toString().slice(0,15);
}

// event constructor
function Event(eventData) {
  this.name = eventData.title;
  this.event_date = eventData.start_time.slice(0,10);
  this.link = eventData.url;
  this.summary = eventData.description;
}

/////////////////////////////////////ROUTES/////////////////////////

app.get('/location',locationHandler);
app.get('/weather', weatherHandler);
// app.get('/events', eventHandler);

app.use('*', nonFoundHandler);
app.use(errorHandler);

///////////////////////////HANDLER FUNCTIONS//////////////////////////////

function locationHandler (request,response){
    let city = request.query.city;
    let sql = 'SELECT * FROM city_explorer WHERE search_query = $1;';
    let safeValues = [city];
    client.query (sql, safeValues)
      .then (results  => {
        console.log ('this is the city:',results,'this is rows', results.rows);
        if (results.rows.length>0){
          console.log('found results in db');
          response.send(results.rows[0]);
          return;
        }
        else {
          console.log('could not find in the db going to the api');
          let key = process.env.LOCATION_IQ_KEY;
          let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;

          superagent.get(url)
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
          .catch((err) => {
            errorHandler ('So sorry deeper Location handler here', err);
          })
        }
      })
      .catch((err) => {
        errorHandler ('So sorry outside Location handler here', err);
      })
}

function weatherHandler(request,response){
  // get data from darksky.json
    console.log('the weather data is working');
    let latitude = request.query.latitude;
    let longitude = request.query.longitude;
    let key = process.env.DARKSKY_API_KEY;
    let url = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`;
    console.log('url works fine here', url);
    superagent.get(url)
      .then(weatherobj =>  {
        console.log('what is breakkng this?');
        // console.log('this is my wwwweather response array', weatherobj.body.daily.data);
        const weatherresponseArray = weatherobj.body.daily.data.map(obj => new WeatherObject(obj));
        response.status(200).json(weatherresponseArray);
      })
      .catch((err)  => { 
        errorHandler ('So sorry Weather handler not working', err)
      });
}

//////////////////////////ERROR HANDLER //////////////////////////////////

function errorHandler(error, request, response) {
  console.log('ERROR',error);
  response.status(500).send(error);
}

function nonFoundHandler(request, response) {response.status(404).send('this route does not exist')
};


// app.listen(PORT, () => {
//   console.log(`app is up and running on city explorer: ${PORT}`)});

// // Connect to DB and Start the Web Server
client.connect()
  .then( () => {
    app.listen(PORT, () => {
      console.log(`app is up and running on city explorer: ${PORT}`);
    });
  })
  .catch(err => {
    throw `PG Startup Error: ${err.message}`;
  })