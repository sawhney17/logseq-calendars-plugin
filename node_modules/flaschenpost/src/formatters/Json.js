'use strict';

const { Transform } = require('stream');

class Json extends Transform {
  constructor (options) {
    options = options || {};
    options.objectMode = true;

    super(options);
  }

  _transform (chunk, encoding, callback) {
    this.push(`${JSON.stringify(chunk)}\n`);
    callback();
  }
}

module.exports = Json;
