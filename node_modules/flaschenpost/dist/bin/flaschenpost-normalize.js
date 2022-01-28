#!/usr/bin/env node
'use strict';
/* eslint-disable no-process-env */

process.env.FLASCHENPOST_FORMATTER = 'json';
/* eslint-enable no-process-env */

var split2 = require('split2');

var flaschenpost = require('../flaschenpost');

var logger = flaschenpost.getLogger();

var isEmpty = function isEmpty(line) {
  return !line;
};

var isFlaschenpostJson = function isFlaschenpostJson(line) {
  return line.startsWith('{"host":"');
};

process.stdin.pipe(split2()).on('data', function (line) {
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