'use strict';

function constructNewArray (arr, constructor) {
  return arr.map((obj) => new constructor (obj));
}

module.exports = constructNewArray;