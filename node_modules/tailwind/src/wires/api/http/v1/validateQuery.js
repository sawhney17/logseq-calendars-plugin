'use strict';

const ajv = require('ajv');

const ajvInstance = ajv({
  jsonPointers: true
});

const validateQuery = function (query) {
  if (!query) {
    throw new Error('Query is missing.');
  }

  const isValid = ajvInstance.validate({
    type: 'object',
    properties: {
      skip: { type: 'number', minimum: 0 },
      take: { type: 'number', minimum: 1 },
      where: { type: 'object', additionalProperties: true },
      orderBy: {
        type: 'object',
        additionalProperties: {
          type: 'string',
          enum: [ 'asc', 'ascending', 'desc', 'descending' ]
        }
      }
    },
    additionalProperties: false
  }, query);

  if (!isValid) {
    throw new Error('Invalid query.');
  }
};

module.exports = validateQuery;
