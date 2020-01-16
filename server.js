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

const locations = {};


/////////////////////////////////////ROUTES/////////////////////////
// route: to location
// app.get('/location',locationHandler);
app.get('/location',newlocationHandler);
// route: to weather
app.get('/weather', weatherHandler);
app.get('*', nonFoundHandler); 

///////////////////////////HANDLER FUNCTIONS////////////////////////////////

function locationHandler(request,response){
    // console.log(request.query.city);
  try{
    let city = request.query.city;
    const geoData = require('./data/geo.json');
    let geoDataResults = geoData[0];

    let locations = new MapObject(city, geoDataResults);
  
    response.send(locations);
    response.status(200).json(locations);
  }
  catch (error) {
    errorHandler ('So sorry', request, response);
  }
}
function newlocationHandler (request,response){
  try {
    let city = request.query.city;
    let {search_query, formatted_query, latitude, longitude} = request.query;
    let key = process.env.GEOCODE_API_KEY;
    const url = ``;
    if (locations[])
  }
  catch {

  }
}
function weatherHandler(request,response){
  // get data from darksky.json
  try {
    let weatherresponseArray = [];
    console.log('the weather data is working');
    const weatherData = require('./data/darksky.json');
    let weatherArray = weatherData.daily.data;

    weatherresponseArray = weatherArray.map(obj => new WeatherObject(obj));

  // console.log('this is my wweather response array', weatherresponseArray);

    response.send(weatherresponseArray);
    response.status(200).json(weatherresponseArray);
  }
  catch (error) {
    errorHandler ('So sorry', request, response);
  }
}

// function newweatherHandler (request, response){
//   let city = request.query.city;
//   let latitude = request.query.latitude;
//   let longitude = request.query.longitude;
//   let key = process.env.GEOCODE_API_KEY;
//   const url = ``;

// }

//////////////////////////ERROR HANDLER //////////////////////////////////

function errorHandler(error, request, response) { console.log('ERROR',error);
  response.status(500).send(error);
}

function nonFoundHandler(request, response) {response.status(404).send('this route does not exist')
};


////////////////////////// CONSTRUCTORS////////////////////////////////////

//constructor function to get the information from geo.json file into the array
function MapObject (city, geoData) {
this.search_query = city;
this.formatted_query = geoData.display_name;
this.latitude= geoData.lat;
this.longitude = geoData.lon;
}

/// weather constructor
function WeatherObject (weather) {
  this.forecast = weather.summary;
  let normaltimes = new Date(weather.time*1000).toString().slice(0,15);
  // console.log('this is the time', normaltimes);
  this.time = normaltimes;
}



////// SEQUEL APP.GET //////////////////////
// app.get('/add',(request,response) => {
//   let firstName = request.query.first;
//   let lastName = request.query.last;
//   console.log('firstName', firstName, 'lastName', lastName);
//   let sql = 'INSERT INTO people (first_name, last_name) VALUES ('$1', '$2');';
//   let safeValues = [firstName, lastName];
//   client.query(sql, safeValues)
//     .then(results => {
//       response.status(200).json(results);
//     })
//     .catch(error => console.error('error:', error));
})

// turn the PORT on
app.listen(PORT, ()=> console.log(`app is up and running on city explorer: ${PORT}`));
// client.connect()
// .then(app.listen(PORT, ()=> console.log(`app is up and running on city explorer: ${PORT}`));)
// .catch(error) => console.error(err);
