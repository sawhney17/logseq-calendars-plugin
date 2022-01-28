'use strict';

const throwOnUnknownProperties = function (options, properties) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!properties) {
    throw new Error('Properties are missing.');
  }

  Object.keys(options).forEach(key => {
    if (properties.indexOf(key) === -1) {
      throw new Error(`Unknown property ${key}.`);
    }
  });
};

module.exports = throwOnUnknownProperties;
