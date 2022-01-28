'use strict';

const { Transform } = require('stream');

const untildify = require('untildify');

let format;

class Custom extends Transform {
  constructor (options) {
    if (!options) {
      throw new Error('Options are missing.');
    }
    if (!options.js) {
      throw new Error('JavaScript is missing.');
    }

    /* eslint-disable global-require */
    format = require(untildify(options.js));
    /* eslint-enable global-require */

    options.objectMode = true;

    super(options);
  }

  _transform (chunk, encoding, callback) {
    const result = format(chunk);

    this.push(result);
    callback();
  }
}

module.exports = Custom;
