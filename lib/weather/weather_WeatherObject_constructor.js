'use strict';

/// weather constructor
function WeatherObject (weather) {
  this.forecast = weather.summary;
  this.time = new Date(weather.time*1000).toString().slice(0,15);
}

module.exports = WeatherObject;