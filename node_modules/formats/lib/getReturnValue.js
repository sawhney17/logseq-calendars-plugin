'use strict';

const getReturnValue = function (value, options) {
  const useBooleanAsReturnValue = !options || !options.hasOwnProperty('default');

  return {
    true: useBooleanAsReturnValue ? true : value,
    false: useBooleanAsReturnValue ? false : options.default
  };
};

module.exports = getReturnValue;
