'use strict';

const normalize = function (value) {
  try {
    return JSON.parse(value);
  } catch (ex) {
    return value;
  }
};

const processEnv = function (key, defaultValue = undefined) {
  if (!key) {
    const environmentVariables = {};

    /* eslint-disable no-process-env */
    Object.keys(process.env).forEach(name => {
      environmentVariables[name] = normalize(process.env[name]);
    });
    /* eslint-enable no-process-env */

    return environmentVariables;
  }

  /* eslint-disable no-process-env */
  const value = process.env[key];
  /* eslint-enable no-process-env */

  if (value === undefined && defaultValue !== undefined) {
    return defaultValue;
  }
  if (value === undefined && defaultValue === undefined) {
    return undefined;
  }

  return normalize(value);
};

module.exports = processEnv;
