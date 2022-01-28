'use strict';

const shell = require('shelljs');

const post = async function () {
  shell.exec('docker kill rabbitmq; docker rm -v rabbitmq');
};

module.exports = post;
