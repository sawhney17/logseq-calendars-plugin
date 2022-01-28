'use strict';

const path = require('path');

const fs = require('fs-extra');

const pre = async function () {
  const packageJson = path.join(__dirname, 'package.json'),
        packageJsonTemplate = path.join(__dirname, '_package.json');

  await fs.copy(packageJsonTemplate, packageJson);
};

module.exports = pre;
