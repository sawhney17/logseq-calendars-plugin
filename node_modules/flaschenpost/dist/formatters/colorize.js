'use strict';

var chalk = require('chalk'),
    forOwn = require('lodash/forOwn');

var defaultLevels = require('../defaultLevels.json');

var map = {};

var getColorFor = function getColorFor(colorOrLevel) {
  if (map[colorOrLevel]) {
    return map[colorOrLevel];
  }

  return colorOrLevel;
};

var colorize = function colorize(text, colorOrLevel, style) {
  var result = chalk[getColorFor(colorOrLevel)](text);

  if (style) {
    result = chalk[style](result);
  }

  return result;
};

forOwn(defaultLevels, function (levelOptions, levelName) {
  map[levelName] = levelOptions.color;
});
module.exports = colorize;