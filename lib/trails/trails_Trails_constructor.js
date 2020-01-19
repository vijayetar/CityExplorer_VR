'use strict';


//new trail constructor
function Trails (traildata) {
  this.name = traildata.name;
  this.location = traildata.location;
  this.length = traildata.length;
  this.stars = traildata.stars;
  this.star_votes = traildata.starVotes;
  this.summary = traildata.summary;
  this.trail_url= traildata.url;
  this.conditions = traildata.conditionStatus;
  this.condition_date = traildata.conditionDate.slice(0,11);
  this.condition_time = traildata.conditionDate.slice(12,21);
}

module.exports = Trails;