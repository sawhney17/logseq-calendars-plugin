'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var getReturnValue = require('../getReturnValue'),
    throwOnUnknownProperties = require('../throwOnUnknownProperties');

var validator = function validator(options) {
  options = options || {};
  options.isOptional = options.isOptional || false;
  options.schema = options.schema || null;
  options.isSchemaRelaxed = options.isSchemaRelaxed || false;

  throwOnUnknownProperties(options, ['isOptional', 'schema', 'isSchemaRelaxed', 'default']);

  if (options.isSchemaRelaxed && !options.schema) {
    throw new Error('Schema is missing.');
  }

  return function (value) {
    var returnValue = getReturnValue(value, options);

    if (value === null || value === undefined) {
      if (options.isOptional) {
        return returnValue.true;
      }

      return returnValue.false;
    }

    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
      return returnValue.false;
    }

    if (!options.schema) {
      return returnValue.true;
    }

    for (var key in options.schema) {
      if (options.schema.hasOwnProperty(key)) {
        if (!options.schema[key](value[key])) {
          return returnValue.false;
        }
      }
    }

    if (!options.isSchemaRelaxed) {
      for (var _key in value) {
        if (value.hasOwnProperty(_key)) {
          if (!options.schema[_key]) {
            return returnValue.false;
          }
        }
      }
    }

    return returnValue.true;
  };
};

module.exports = validator;