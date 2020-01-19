'use strict';

//lib
require('dotenv').config();
const superagent = require('superagent');
const constructNewArray = require('../global/constructorArray function');
const Trails = require('./trails_Trails_constructor');

//function
function trailHandler (request, response) {
  console.log('trying the trail handler');
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let trailapi_key = process.env.TRAIL_API_KEY;
  let trail_url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${trailapi_key}`;
  superagent.get(trail_url)
  .then(trailresults => {
    let trailResultsArray = trailresults.body.trails;
    const trailsArray = constructNewArray (trailResultsArray, Trails);
    response.status(200).json(trailsArray);
  })
  .catch(() => errorHandler('So sorry, the trail handler did not work', request, response));
}

module.exports = trailHandler;
