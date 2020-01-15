'use strict';
// require the libraries
const express = require('express'); 
const app = express();
require('dotenv').config();
//spacing consistancy, needs a space after PORT(HL)
const PORT = process.env.PORT || 3001;
const cors = require('cors'); 


app.use(cors()); 

//////////////ROUTES/////////////////////////
// route: to location
app.get('/location',locationhandler);

// route: to weather
//spacing before the arrow function (HL)
app.get('/weather', weatherhandler);

/////////////HANDLER FUNCTIONS//////////

function locationhandler(request,response){
    // console.log(request.query.city);

    let city = request.query.city;
    const geoData = require('./data/geo.json');
    let geoDataResults = geoData[0];

    let locations = new MapObject(city, geoDataResults);

    response.send(locations);
    response.status(200).json(locations);
}

function weatherhandler(request,response){
  // get data from darksky.json
  let weatherresponseArray = [];
  console.log('the weather data is working');
  const weatherData = require('./data/darksky.json');
  let weatherArray = weatherData.daily.data;

  // call constructor
  // weatherArray.forEach(obj => {
  //   weatherresponseArray.push(new WeatherObject (obj));
  // })

  weatherresponseArray = (weatherArray.map(obj => new WeatherObject(obj)));

  // console.log('this is my wweather response array', weatherresponseArray);

  response.send(weatherresponseArray);
  response.status(200).json(weatherresponseArray);
}

app.get('*',(request, response) => {response.status(404).send('this route does not exist')
});

////////////// CONSTRUCTORS/////////////////

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
  let normaltimes = Date(weather.time*1000);
  normaltimes = normaltimes.slice(0,15);
  // console.log('this is the time', normaltimes);
  this.time = normaltimes;
}


// turn the PORT on
app.listen(PORT, ()=> console.log(`app is up and running on city explorer: ${PORT}`));

//I would delete the zombie code unless you are planning on using it later on (HL)

//overall, very well written code, great job!!! (HL)
