'use strict';

var path = require('path');

var readPackageJson = function readPackageJson(packagePath) {
  try {
    /* eslint-disable global-require */
    var packageJson = require(path.join(packagePath, 'package.json'));
    /* eslint-enable global-require */


    return {
      name: packageJson.name,
      version: packageJson.version
    };
  } catch (ex) {
    return {
      name: '(unknown)',
      version: '(unknown)'
    };
  }
};

module.exports = readPackageJson;