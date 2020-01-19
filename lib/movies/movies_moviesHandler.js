'use strict';


//lib

const superagent = require('superagent');
require('dotenv').config();
const constructNewArray = require('../global/constructorArray function');
const MoviesInfo = require('./movies_MoviesInfo_constructor');

//function

function moviesHandler(request,response){
  let city = request.query.search_query;
  let moviesdb_key = process.env.MOVIE_API_KEY;
  let movies_url = `https://api.themoviedb.org/3/search/movie?api_key=${moviesdb_key}&language=en-US&query=${city}`;
  superagent.get(movies_url)
    .then (allmovieresults => {
      // console.log('these are movie results in the body', allmovieresults.body);
      let movieresults = allmovieresults.body.results;
      const movieresultsArray = constructNewArray (movieresults, MoviesInfo);
      response.status(200).json(movieresultsArray);
    })
    .catch(() => errorHandler ('So sorry, the movie handler is not working', request, response));
}

module.exports = moviesHandler;