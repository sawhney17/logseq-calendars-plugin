'use strict';

var validator = function validator(fn) {
  if (!fn) {
    throw new Error('Validator is missing.');
  }

  return fn;
};

module.exports = validator;