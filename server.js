'use strict';
// require the libraries
const express = require('express'); 
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const superagent = require('superagent');
const cors = require('cors');
app.use(cors());  
// const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => console.error(err));

let locations = {};


/////////////////////////////////////ROUTES/////////////////////////
// app.get('/location',locationHandler);
app.get('/location',newlocationHandler);
app.get('/weather', weatherHandler);
app.use('*', nonFoundHandler); 
app.use(errorHandler);

///////////////////////////HANDLER FUNCTIONS////////////////////////////////

// function locationHandler(request,response){
//     // console.log(request.query.city);
//   try{
//     let city = request.query.city;
//     const geoData = require('./data/geo.json');
//     let geoDataResults = geoData[0];

//     let locations = new MapObject(city, geoDataResults);
  
//     response.send(locations);
//     response.status(200).json(locations);
//   }
//   catch (error) {
//     errorHandler ('So sorry Location handler', request, response);
//   }
// }
function newlocationHandler (request,response){
    let city = request.query.city;
//     // let {search_query, formatted_query, latitude, longitude} = request.query;
    let key = process.env.LOCATION_IQ_KEY;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json/`;
    console.log("I got the newlocationHandler going");
//     ///////need to caching location before making the url call
    if (locations[url]) {
      response.send(locations[url]);
    }
    else {
      superagent.get(url)
        .then(results => {
          console.log("I got the newlocationHandler going");
          console.log("these are results", results.body);
          const geoData = results.body[0];
          const mapObject = new MapObject(city, geoData);
          locations[url] = mapObject;
          response.send(mapObject);
          response.status(200).json(mapObject);

        })
        .catch((error) => {
          errorHandler ('So sorry Location handler here', request, response);
        })
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

  console.log('this is my wweather response array', weatherresponseArray);

    response.send(weatherresponseArray);
    response.status(200).json(weatherresponseArray);
  }
  catch (error) {
    errorHandler ('So sorry Weather handler', request, response);
  }
}

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
this.longitude = geoData.long;
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
// })

// turn the PORT on
app.listen(PORT, ()=> console.log(`app is up and running on city explorer: ${PORT}`));
// client.connect()
// .then(app.listen(PORT, ()=> console.log(`app is up and running on city explorer: ${PORT}`));)
// .catch(error) => console.error(err);
