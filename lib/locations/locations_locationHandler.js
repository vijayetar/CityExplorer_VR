'use strict';

const superagent = require('superagent');
require('dotenv').config();
const client = require('../global/client');
const errorHandler = require('../global/errorhandler');


//lib
const MapObject = require('./location_MapObject_constructor');


//function
function locationHandler (request,response){
  let city = request.query.city;
  let sql = 'SELECT * FROM city_explorer WHERE search_query = $1;';
  let safeValues = [city];
  client.query (sql, safeValues)
    .then (results  => {
      // console.log ('this is the city:',results,'this is rows', results.rows);
      if (results.rows.length>0){
        console.log('found results in db');
        response.send(results.rows[0]);
        return;
      }
      else {
        console.log('could not find in the db going to the api');
        let locationIQ_key = process.env.LOCATION_IQ_KEY;
        let locationIQ_url = `https://us1.locationiq.com/v1/search.php?key=${locationIQ_key}&q=${city}&format=json&limit=1`;

        superagent.get (locationIQ_url)
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
        .catch(() => {
          errorHandler ('So sorry deeper Location handler here', request, response);
        })
      }
    })
    .catch(() => {
      errorHandler ('So sorry outside Location handler here', request, response);
    })
}


module.exports = locationHandler;