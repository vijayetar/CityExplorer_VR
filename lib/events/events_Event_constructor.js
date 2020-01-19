'use strict';

// event constructor
function Event(eventData) {
  this.name = eventData.title;
  this.event_date = eventData.start_time.slice(0,10);
  this.link = eventData.url;
  this.summary = eventData.description;
}

module.exports = Event;