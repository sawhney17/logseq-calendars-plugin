'use strict';

const getReturnValue = require('../getReturnValue'),
      throwOnUnknownProperties = require('../throwOnUnknownProperties');

const validator = function (options) {
  options = options || {};

  throwOnUnknownProperties(options, [ 'default' ]);

  return function (value) {
    const returnValue = getReturnValue(value, options);

    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
      return returnValue.false;
    }

    return returnValue.true;
  };
};

module.exports = validator;
