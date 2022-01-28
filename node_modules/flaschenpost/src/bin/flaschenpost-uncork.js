#!/usr/bin/env node

'use strict';

const processenv = require('processenv'),
      split2 = require('split2');

const FormatterCustom = require('../formatters/Custom'),
      FormatterGelf = require('../formatters/Gelf'),
      FormatterHumanReadable = require('../formatters/HumanReadable'),
      FormatterJson = require('../formatters/Json');

const requestedFormatter =
  processenv('FLASCHENPOST_FORMATTER') ||
  (process.stdout.isTTY ? 'human' : 'json');

let formatter;

if (requestedFormatter === 'gelf') {
  formatter = new FormatterGelf();
} else if (requestedFormatter === 'human') {
  formatter = new FormatterHumanReadable();
} else if (requestedFormatter === 'json') {
  formatter = new FormatterJson();
} else if (requestedFormatter.startsWith('js:')) {
  formatter = new FormatterCustom({ js: /^js:(.*)$/g.exec(requestedFormatter)[1] });
} else {
  throw new Error('Unsupported formatter.');
}

formatter.pipe(process.stdout);

process.stdin.pipe(split2()).on('data', data => {
  const message = JSON.parse(data);

  formatter.write(message);
});
