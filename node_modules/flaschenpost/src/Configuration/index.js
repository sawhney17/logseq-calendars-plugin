'use strict';

const os = require('os');

const cloneDeep = require('lodash/cloneDeep'),
      forEach = require('lodash/forEach'),
      forOwn = require('lodash/forOwn'),
      includes = require('lodash/includes'),
      keys = require('lodash/keys'),
      varname = require('varname');

const defaultLevels = require('../defaultLevels.json'),
      parseLogDebugModulesEnvironmentVariable = require('./parseLogDebugModulesEnvironmentVariable'),
      parseLogLevelsEnvironmentVariable = require('./parseLogLevelsEnvironmentVariable');

class Configuration {
  constructor () {
    this.setLevels(cloneDeep(defaultLevels));
    this.setHost(os.hostname());

    this.debugModules = parseLogDebugModulesEnvironmentVariable();
  }

  set (key, options) {
    const fn = varname.camelback(`set-${key}`);

    if (!this[fn]) {
      throw new Error(`Unknown key '${key}' specified.`);
    }

    this[fn](options);
  }

  setLevels (levels) {
    if (!levels) {
      throw new Error('Levels are missing.');
    }

    this.levels = levels;

    let enabledLogLevels = parseLogLevelsEnvironmentVariable();

    if (enabledLogLevels.length === 0) {
      return;
    }

    if (enabledLogLevels.length === 1 && enabledLogLevels[0] === '*') {
      enabledLogLevels = keys(this.levels);
    }

    forEach(enabledLogLevels, enabledLogLevel => {
      if (!includes(keys(this.levels), enabledLogLevel)) {
        throw new Error(`Unknown log level ${enabledLogLevel}.`);
      }
    });

    forOwn(this.levels, (levelOptions, levelName) => {
      levelOptions.enabled = includes(enabledLogLevels, levelName);
    });
  }

  setHost (host) {
    if (!host) {
      throw new Error('Host is missing.');
    }

    this.host = host;
  }
}

module.exports = Configuration;
