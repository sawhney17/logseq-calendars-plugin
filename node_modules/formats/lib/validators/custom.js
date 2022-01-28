'use strict';

const validator = function (fn) {
  if (!fn) {
    throw new Error('Validator is missing.');
  }

  return fn;
};

module.exports = validator;
