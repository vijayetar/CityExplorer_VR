'use strict';

function errorHandler(error, request, response) {
  console.log('ERROR',error);
  response.status(500).send(error);
}

module.exports = errorHandler;