'use strict';

// yelp review constructor
function YelpReviews (yelpData) {
  this.name = yelpData.name;
  this.image_url = yelpData.image_url;
  this.price = yelpData.price;
  this.rating = yelpData.rating;
  this.url = yelpData.url;
}
module.exports = YelpReviews;