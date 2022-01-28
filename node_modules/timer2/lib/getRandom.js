'use strict';

const getRandom = function (min, max) {
  if (min === undefined) {
    throw new Error('Min is missing.');
  }
  if (max === undefined) {
    throw new Error('Max is missing.');
  }

  const random = Math.floor(Math.random() * (max - min + 1)) + min;

  return random;
};

module.exports = getRandom;
