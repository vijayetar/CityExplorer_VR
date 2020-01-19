'use strict';

//lib
const errorHandler = require('../global/errorhandler');
const superagent = require('superagent');
require('dotenv').config();
const Event = require('../events/events_Event_constructor');
const constructNewArray = require('../global/constructorArray function');
// const errorHandler = require('../global/errorhandler');

//function

function eventHandler(request,response){
  console.log('running the eventful handler',request.query.search_query);
  let city = request.query.search_query;
  let eventful_key = process.env.EVENTFUL_API_KEY;
  let event_url = `http://api.eventful.com/json/events/search?keywords=music&location=${city}&app_key=${eventful_key}`;
  superagent.get(event_url)
  .then (eventfulresults => {
    let eventfulparsedresults = JSON.parse(eventfulresults.text);
    let eventfulparsedresultsArray = eventfulparsedresults.events.event;
    const eventfulresultsArray = constructNewArray( eventfulparsedresultsArray, Event);
    response.status(200).json(eventfulresultsArray);
  })
  .catch(() => {
    errorHandler ('So, sorry, the eventful Handler is not working', request, response)
  });
}

module.exports = eventHandler;