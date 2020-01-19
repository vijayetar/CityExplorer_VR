'use strict';

// movie constructor
function MoviesInfo (movieData) {
  this.title = movieData.original_title;
  this.overview = movieData.overview;
  this.average_votes = movieData.vote_average;
  this.total_votes = movieData.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`;
  this.popularity = movieData.popularity;
  this.released_on = movieData.release_date;
}

module.exports = MoviesInfo;