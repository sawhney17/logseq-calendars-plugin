'use strict';

const fs = require('fs'),
      path = require('path');

const promisify = require('util.promisify');

const unlink = promisify(fs.unlink);

const post = async function () {
  const packageJson = path.join(__dirname, 'package.json');

  await unlink(packageJson);
};

module.exports = post;
