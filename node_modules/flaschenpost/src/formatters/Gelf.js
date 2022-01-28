'use strict';

const { Transform } = require('stream');

class Gelf extends Transform {
  constructor (options) {
    options = options || {};
    options.objectMode = true;

    super(options);

    this.predefinedKeys = [
      'version', 'host', 'short_message', 'full_message',
      'timestamp', 'level', 'facility', 'line', 'file'
    ];

    this.mappedKeys = {
      message: 'short_message'
    };

    this.defaultValues = {
      version: '1.1'
    };
  }

  _transform (chunk, encoding, callback) {
    const result = Object.assign({}, this.defaultValues);

    Object.keys(chunk).forEach(key => {
      let mappedKey;

      if (this.predefinedKeys.includes(key)) {
        mappedKey = key;
      } else if (this.mappedKeys[key]) {
        mappedKey = this.mappedKeys[key];
      } else {
        mappedKey = `_${key}`;
      }

      result[mappedKey] = chunk[key];
    });

    this.push(JSON.stringify(result));
    callback();
  }
}

module.exports = Gelf;
