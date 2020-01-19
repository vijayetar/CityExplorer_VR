'use strict';

//location constructor
function MapObject (city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude= geoData.lat;
  this.longitude = geoData.lon;
}

module.exports = MapObject;