'use strict';

const _ = require('lodash');

const sanitizeMetadata = function (metadata) {
  const clonedValues = [];

  const cloner = function (value) {
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
