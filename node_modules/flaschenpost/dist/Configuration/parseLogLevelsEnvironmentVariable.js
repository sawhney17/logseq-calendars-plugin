'use strict';

var parseEnvironmentVariable = function parseEnvironmentVariable() {
  /* eslint-disable no-process-env */
  var logLevels = process.env.LOG_LEVELS;
  /* eslint-enable no-process-env */

  if (!logLevels) {
    return [];
  }

  return logLevels.split(',').map(function (logLevel) {
    return logLevel.trim().toLowerCase();
  });
};

module.exports = parseEnvironmentVariable;