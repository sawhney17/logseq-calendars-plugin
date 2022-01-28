'use strict';

const { Writable } = require('stream');

class WriteStream extends Writable {
  constructor (channel, name) {
    super({ objectMode: true });

    this.channel = channel;
    this.name = name;
  }

  _write (chunk, encoding, callback) {
    this.channel.publish(this.name, '', Buffer.from(JSON.stringify(chunk), 'utf8'), {
      persistent: true
    });

    callback(null);
  }
}

module.exports = WriteStream;
