'use strict';

const getReturnValue = require('../getReturnValue'),
      throwOnUnknownProperties = require('../throwOnUnknownProperties');

const validator = function (options) {
  options = options || {};

  throwOnUnknownProperties(options, [ 'default' ]);

  return function (value) {
    const returnValue = getReturnValue(value, options);

    if (typeof value !== 'boolean') {
      return returnValue.false;
    }

    return returnValue.true;
  };
};

module.exports = validator;
