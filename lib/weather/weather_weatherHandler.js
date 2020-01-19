'use strict';

//lib
const errorHandler = require('../global/errorhandler');
const superagent = require('superagent');
require('dotenv').config();
const WeatherObject = require('../weather/weather_WeatherObject_constructor');
const constructNewArray = require('../global/constructorArray function');

//function

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

module.exports = weatherHandler;