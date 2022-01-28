'use strict';

const isArray = require('lodash/isArray'),
      isObject = require('lodash/isObject');

const objectFrom = function (data, isGiven) {
  if (!isGiven) {
    return;
  }
  if (isObject(data) && !isArray(data) && data !== null) {
    return data;
  }

  return { value: data };
};

module.exports = objectFrom;
