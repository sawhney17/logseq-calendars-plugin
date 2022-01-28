'use strict';

const processenv = require('processenv');

const parseLogDebugModulesEnvironmentVariable = function () {
  const logDebugModules = processenv('LOG_DEBUG_MODULES');

  if (!logDebugModules) {
    return [];
  }

  return logDebugModules.split(',');
};

module.exports = parseLogDebugModulesEnvironmentVariable;
