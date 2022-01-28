#!/usr/bin/env node

'use strict';

/* eslint-disable no-process-env */
process.env.FLASCHENPOST_FORMATTER = 'json';
/* eslint-enable no-process-env */

const split2 = require('split2');

const flaschenpost = require('../flaschenpost');

const logger = flaschenpost.getLogger();

const isEmpty = function (line) {
  return !line;
};

const isFlaschenpostJson = function (line) {
  return line.startsWith('{"host":"');
};

process.stdin.pipe(split2()).on('data', line => {
  if (isFlaschenpostJson(line)) {
    process.stdout.write(line);
    process.stdout.write('\n');

    return;
  }
  if (isEmpty(line)) {
    return;
  }

  logger.warn(line);
});
