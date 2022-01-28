'use strict';

var getRandom = function getRandom(min, max) {
  if (min === undefined) {
    throw new Error('Min is missing.');
  }
  if (max === undefined) {
    throw new Error('Max is missing.');
  }

  var random = Math.floor(Math.random() * (max - min + 1)) + min;

  return random;
};

module.exports = getRandom;