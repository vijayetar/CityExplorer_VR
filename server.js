'use strict';
// require the libraries
const express = require('express'); //you have to do npm install
const app = express();
require('dotenv').config();
const PORT = process.env.PORT|| 3001;
const cors = require('cors'); //cors is the policeman

app.use(cors()); 

//routes
// route: to location
app.get('/location',(request,response) => {
  // console.log(request.query.city);
  // get city information from the front end
  let city = request.query.city;
  const geoData = require('./data/geo.json'); //get the geo data from the json file
  // }
  let geoDataResults = geoData[0];
  let location = new MapObject(city, geoDataResults);

  response.status(200).send(location);
});

// route: to weather

app.get('/weather',(request,response)=> {
  // get data from darksky.json
  const weatherData = require('./data/darksky.json');
})

let dataArray = [];
//constructor function to get the information from geo.json file into the array
function MapObject (city, geoData) {
this.search_query = city;
this.formatted_query = geoData.display_name;
this.latitude= geoData.lat;
this.longitude = geoData.lon;
dataArray.push(this);
}

function WeatherObject (city, weatherData) {
  this.
}

app.get('*',(request, response) => {response.status(404).send('this route does not exist')
});
// turn the PORT on
app.listen(PORT, ()=> console.log(`app is up and running on city explorer: ${PORT}`));

[
  {
    "forecast": "Partly cloudy until afternoon.",
    "time": "Mon Jan 01 2001"
  },
  {
    "forecast": "Mostly cloudy in the morning.",
    "time": "Tue Jan 02 2001"
  },
  ...
]