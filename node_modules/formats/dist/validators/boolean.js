'use strict';

var getReturnValue = require('../getReturnValue'),
    throwOnUnknownProperties = require('../throwOnUnknownProperties');

var validator = function validator(options) {
  options = options || {};

  throwOnUnknownProperties(options, ['default']);

  return function (value) {
    var returnValue = getReturnValue(value, options);

    if (typeof value !== 'boolean') {
      return returnValue.false;
    }

    return returnValue.true;
  };
};

module.exports = validator;