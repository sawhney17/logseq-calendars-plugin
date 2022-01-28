'use strict';

var getReturnValue = require('../getReturnValue'),
    throwOnUnknownProperties = require('../throwOnUnknownProperties');

var validator = function validator(options) {
  options = options || {};

  throwOnUnknownProperties(options, ['default']);

  return function (value) {
    var returnValue = getReturnValue(value, options);

    if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(value)) {
      return returnValue.false;
    }

    return returnValue.true;
  };
};

module.exports = validator;