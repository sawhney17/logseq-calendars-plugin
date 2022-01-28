'use strict';

const chalk = require('chalk'),
      forOwn = require('lodash/forOwn');

const defaultLevels = require('../defaultLevels.json');

const map = {};

const getColorFor = function (colorOrLevel) {
  if (map[colorOrLevel]) {
    return map[colorOrLevel];
  }

  return colorOrLevel;
};

const colorize = function (text, colorOrLevel, style) {
  let result = chalk[getColorFor(colorOrLevel)](text);

  if (style) {
    result = chalk[style](result);
  }

  return result;
};

forOwn(defaultLevels, (levelOptions, levelName) => {
  map[levelName] = levelOptions.color;
});

module.exports = colorize;
