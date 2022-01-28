'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var normalize = function normalize(value) {
  try {
    return JSON.parse(value);
  } catch (ex) {
    return value;
  }
};

var processEnv = function processEnv(key) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  if (!key) {
    var environmentVariables = {};

    /* eslint-disable no-process-env */
    (0, _keys2.default)(process.env).forEach(function (name) {
      environmentVariables[name] = normalize(process.env[name]);
    });
    /* eslint-enable no-process-env */

    return environmentVariables;
  }

  /* eslint-disable no-process-env */
  var value = process.env[key];
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