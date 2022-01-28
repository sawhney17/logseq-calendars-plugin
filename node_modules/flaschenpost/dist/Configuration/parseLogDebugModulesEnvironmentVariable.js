'use strict';

var processenv = require('processenv');

var parseLogDebugModulesEnvironmentVariable = function parseLogDebugModulesEnvironmentVariable() {
  var logDebugModules = processenv('LOG_DEBUG_MODULES');

  if (!logDebugModules) {
    return [];
  }

  return logDebugModules.split(',');
};

module.exports = parseLogDebugModulesEnvironmentVariable;