'use strict';

var getReturnValue = function getReturnValue(value, options) {
  var useBooleanAsReturnValue = !options || !options.hasOwnProperty('default');

  return {
    true: useBooleanAsReturnValue ? true : value,
    false: useBooleanAsReturnValue ? false : options.default
  };
};

module.exports = getReturnValue;