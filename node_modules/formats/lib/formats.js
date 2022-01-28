'use strict';

const getReturnValue = require('./getReturnValue'),
      throwOnUnknownProperties = require('./throwOnUnknownProperties');

const formats = {};

// Basically, the following lines could be replaced by a single call to the
// require-all module, but this would break browserify compatibility. Hence,
// the require calls are made manually here.
formats.alphanumeric = require('./validators/alphanumeric');
formats.boolean = require('./validators/boolean');
formats.custom = require('./validators/custom');
formats.date = require('./validators/date');
formats.email = require('./validators/email');
formats.function = require('./validators/function');
formats.ip = require('./validators/ip');
formats.mac = require('./validators/mac');
formats.number = require('./validators/number');
formats.object = require('./validators/object');
formats.regex = require('./validators/regex');
formats.string = require('./validators/string');
formats.uuid = require('./validators/uuid');

Object.keys(formats).forEach(key => {
  const newKey = `is${key[0].toUpperCase()}${key.substring(1)}`;

  formats[newKey] = function (value, options) {
    return formats[key](options)(value);
  };
});

formats.getReturnValue = getReturnValue;
formats.throwOnUnknownProperties = throwOnUnknownProperties;

module.exports = formats;
