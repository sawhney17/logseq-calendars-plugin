'use strict';

const getReturnValue = require('../getReturnValue'),
      throwOnUnknownProperties = require('../throwOnUnknownProperties');

const validator = function (options) {
  options = options || {};
  options.min = options.min || new Date(0);
  options.max = options.max || new Date(Number.MAX_SAFE_INTEGER);

  throwOnUnknownProperties(options, [ 'min', 'max', 'default' ]);

  return function (value) {
    const returnValue = getReturnValue(value, options);

    if (!(value instanceof Date)) {
      return returnValue.false;
    }

    if (value < options.min) {
      return returnValue.false;
    }

    if (value > options.max) {
      return returnValue.false;
    }

    return returnValue.true;
  };
};

module.exports = validator;
