'use strict';

const parseEnvironmentVariable = function () {
  /* eslint-disable no-process-env */
  const logLevels = process.env.LOG_LEVELS;
  /* eslint-enable no-process-env */

  if (!logLevels) {
    return [];
  }

  return logLevels.split(',').map(logLevel => logLevel.trim().toLowerCase());
};

module.exports = parseEnvironmentVariable;
