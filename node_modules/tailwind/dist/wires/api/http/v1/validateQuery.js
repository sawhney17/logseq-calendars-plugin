'use strict';

var ajv = require('ajv');

var ajvInstance = ajv({
  jsonPointers: true
});

var validateQuery = function validateQuery(query) {
  if (!query) {
    throw new Error('Query is missing.');
  }

  var isValid = ajvInstance.validate({
    type: 'object',
    properties: {
      skip: {
        type: 'number',
        minimum: 0
      },
      take: {
        type: 'number',
        minimum: 1
      },
      where: {
        type: 'object',
        additionalProperties: true
      },
      orderBy: {
        type: 'object',
        additionalProperties: {
          type: 'string',
          enum: ['asc', 'ascending', 'desc', 'descending']
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