'use strict';

const jsonLines = require('./route')({ heartbeatInterval: 90 });

module.exports = jsonLines;
