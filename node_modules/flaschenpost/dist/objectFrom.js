'use strict';

var isArray = require('lodash/isArray'),
    isObject = require('lodash/isObject');

var objectFrom = function objectFrom(data, isGiven) {
  if (!isGiven) {
    return;
  }

  if (isObject(data) && !isArray(data) && data !== null) {
    return data;
  }

  return {
    value: data
  };
};

module.exports = objectFrom;