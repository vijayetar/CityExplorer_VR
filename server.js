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

let cachedLocations = {};


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

/////////////////////////////////////ROUTES/////////////////////////

app.get('/location',locationHandler);
app.get('/weather', weatherHandler);
app.use('*', nonFoundHandler); 
app.use(errorHandler);

///////////////////////////HANDLER FUNCTIONS//////////////////////////////

function locationHandler (request,response){
    let city = request.query.city;
    let key = process.env.LOCATION_IQ_KEY;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
    
///need to caching location using url before making the url call, it can also be done with object
    if (cachedLocations[url]) {
      response.send(cachedLocations[url]);
    }
    else {
      superagent.get(url)
        .then(locresults => {
          console.log("I got the newlocationHandler going");
          // console.log("these are results", locresults.body);
          const geoData = locresults.body[0];
          const mapObject = new MapObject(city, geoData);
          // console.log("these are MapObject", mapObject);
          cachedLocations[url] = mapObject;
          // response.send(mapObject);
          response.status(200).json(mapObject);

        })
        .catch(() => {
          errorHandler ('So sorry Location handler here', request, response);
        })
    }
}

function weatherHandler(request,response){
  // get data from darksky.json
    console.log('the weather data is working');
    let latitude = request.query.latitude;
    let longitude = request.query.longitude;
    let key = process.env.DARKSKY_API_KEY;
    let url = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`;
    console.log('url works fine here', url);
    // dbSelect(city);
    superagent.get(url)
      .then(weatherobj =>  {
        console.log('what is breakkng this?');
        console.log('this is my wwwweather response array', weatherobj.body.daily.data);
        const weatherresponseArray = weatherobj.body.daily.data.map(obj => new WeatherObject(obj));
        response.status(200).json(weatherresponseArray);
      })
      .catch((error)  => { 
        errorHandler ('So sorry Weather handler not working', request, response)
      });
}

// function dbSelect (city) {
//     let SQL = 'SELECT * FROM city_explorer WHERE location = $1';
//     let values = [city];
//     client.query (SQL, values)
//       .then (results  => console.log ('this is the city:',results))
//       .catch(() => console.log('ERROR: this is in the db did not work'));
// }

// function dbInsert () {
//   /// if match present then insert it into the db
//   let SQL = `INSERT INTO city_explorer (location, latitude, longitude) VALUES ($1, $2, $3) RETURNING *`;
//   let safeValues = [location, latitude, longitude];
//   client.query(SQL, safeValues)
//     .then( results => {
//       response.status(200).json (results);
//     })
// }

//////////////////////////ERROR HANDLER //////////////////////////////////

function errorHandler(error, request, response) { console.log('ERROR',error);
  response.status(500).send(error);
}

function nonFoundHandler(request, response) {response.status(404).send('this route does not exist')
};


app.listen(PORT, () => {
  console.log(`app is up and running on city explorer: ${PORT}`)});

// // Connect to DB and Start the Web Server
// client.connect()
//   .then( () => {
//     app.listen(PORT, () => {
//       console.log(`app is up and running on city explorer: ${PORT}`);
//     });
//   })
//   .catch(err => {
//     throw `PG Startup Error: ${err.message}`;
//   });
