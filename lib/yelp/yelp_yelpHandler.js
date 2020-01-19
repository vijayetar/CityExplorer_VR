'use strict';

//lib
const superagent = require('superagent');
require('dotenv').config();
const constructNewArray = require('../global/constructorArray function');
const YelpReviews = require('./yelp_YelpReviews_constructor');

//function
function yelpHandler (request, response) {
  let city = request.query.search_query;
  let yelpapi_key = process.env.YELP_API_KEY;
  const yelp_url = `https://api.yelp.com/v3/businesses/search?restaurant&location=${city}}`;

  superagent.get(yelp_url)
  .set({'Authorization': `Bearer ${yelpapi_key}`})
  .then(yelpresults => {
    let yelpparsedresults = JSON.parse(yelpresults.text);
    let yelpparsedresultArray = yelpparsedresults.businesses;
    const yelpreviewsArray = constructNewArray (yelpparsedresultArray, YelpReviews);
    response.status(200).json(yelpreviewsArray);
  })
  .catch(() => errorHandler ('So sorry, the yelp handler is not working', request, response));
}

module.exports = yelpHandler;