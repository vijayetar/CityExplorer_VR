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

    superagent.get(url)
      .then(weatherobj =>  {
        console.log('what is breakkng this?');
        console.log('this is my wwwweather response array', weatherobj.body.daily.data);
        const weatherresponseArray = weatherobj.body.daily.data.map(obj => new WeatherObject(obj));
        // response.send(weatherresponseArray);
        response.status(200).json(weatherresponseArray);
      })
      .catch((error)  => { 
        errorHandler ('So sorry Weather handler not working', request, response)
      });
}

//////////////////////////ERROR HANDLER //////////////////////////////////

function errorHandler(error, request, response) { console.log('ERROR',error);
  response.status(500).send(error);
}

function nonFoundHandler(request, response) {response.status(404).send('this route does not exist')
};


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
