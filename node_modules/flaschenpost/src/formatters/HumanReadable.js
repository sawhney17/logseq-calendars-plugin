'use strict';

const { Transform } = require('stream');

const moment = require('moment'),
      stringifyObject = require('stringify-object');

const colorize = require('./colorize');

class HumanReadable extends Transform {
  constructor (options) {
    options = options || {};
    options.objectMode = true;

    super(options);
  }

  _transform (chunk, encoding, callback) {
    const timestamp = moment.utc(chunk.timestamp);
    let origin = '',
        result = '';

    origin = `${chunk.host}`;
    if (chunk.application) {
      // Be backward compatible and allow to parse logs without application data
      origin += `::${chunk.application.name}@${chunk.application.version}`;
    }
    if (!chunk.application || chunk.application.name !== chunk.module.name) {
      // Do not print the same module information twice
      origin += `::${chunk.module.name}@${chunk.module.version}`;
    }
    if (chunk.source) {
      origin += ` (${chunk.source})`;
    }

    result += colorize(`${chunk.message} (${chunk.level})`, chunk.level, 'bold');
    result += '\n';
    result += colorize(origin, 'white');
    result += '\n';
    result += colorize(`${timestamp.format('HH:mm:ss.SSS')}@${timestamp.format('YYYY-MM-DD')} ${chunk.pid}#${chunk.id}`, 'gray');
    result += '\n';
    if (chunk.metadata) {
      result += colorize(stringifyObject(chunk.metadata, {
        indent: '  ',
        singleQuotes: true
      }).replace(/\\n/g, '\n'), 'gray');
      result += '\n';
    }
    result += colorize('\u2500'.repeat(process.stdout.columns || 80), 'gray');
    result += '\n';

    this.push(result);
    callback();
  }
}

module.exports = HumanReadable;
