'use strict';

const getReturnValue = require('../getReturnValue'),
      throwOnUnknownProperties = require('../throwOnUnknownProperties');

const validator = function (options) {
  options = options || {};
  options.minLength = options.minLength || 0;
  options.maxLength = options.maxLength || Number.MAX_VALUE;

  throwOnUnknownProperties(options, [ 'minLength', 'maxLength', 'default' ]);

  return function (value) {
    const returnValue = getReturnValue(value, options);

    if (typeof value !== 'string') {
      return returnValue.false;
    }

    if (value.length < options.minLength) {
      return returnValue.false;
    }

    if (value.length > options.maxLength) {
      return returnValue.false;
    }

    if (!/^[a-zA-Z0-9]*$/.test(value)) {
      return returnValue.false;
    }

    return returnValue.true;
  };
};

module.exports = validator;
