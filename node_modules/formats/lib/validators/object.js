'use strict';

const getReturnValue = require('../getReturnValue'),
      throwOnUnknownProperties = require('../throwOnUnknownProperties');

const validator = function (options) {
  options = options || {};
  options.isOptional = options.isOptional || false;
  options.schema = options.schema || null;
  options.isSchemaRelaxed = options.isSchemaRelaxed || false;

  throwOnUnknownProperties(options, [ 'isOptional', 'schema', 'isSchemaRelaxed', 'default' ]);

  if (options.isSchemaRelaxed && !options.schema) {
    throw new Error('Schema is missing.');
  }

  return function (value) {
    const returnValue = getReturnValue(value, options);

    if (value === null || value === undefined) {
      if (options.isOptional) {
        return returnValue.true;
      }

      return returnValue.false;
    }

    if (typeof value !== 'object') {
      return returnValue.false;
    }

    if (!options.schema) {
      return returnValue.true;
    }

    for (const key in options.schema) {
      if (options.schema.hasOwnProperty(key)) {
        if (!options.schema[key](value[key])) {
          return returnValue.false;
        }
      }
    }

    if (!options.isSchemaRelaxed) {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          if (!options.schema[key]) {
            return returnValue.false;
          }
        }
      }
    }

    return returnValue.true;
  };
};

module.exports = validator;
