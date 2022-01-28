'use strict';

var _ = require('lodash');

var sanitizeMetadata = function sanitizeMetadata(metadata) {
  var clonedValues = [];

  var cloner = function cloner(value) {
    if (_.isObject(value) && _.includes(clonedValues, value)) {
      return null;
    }

    if (_.isObject(value)) {
      clonedValues.push(value);
    }

    if (!_.isError(value)) {
      return undefined;
    }

    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  };

  return _.cloneDeepWith(metadata, cloner);
};

module.exports = sanitizeMetadata;