'use strict';

const { PassThrough } = require('stream');

class IoPort {
  constructor (app) {
    if (!app) {
      throw new Error('App is missing.');
    }

    this.app = app;
    this.incoming = new PassThrough({ objectMode: true });
    this.outgoing = new PassThrough({ objectMode: true });
  }

  async use (wire) {
    if (!wire) {
      throw new Error('Wire is missing.');
    }

    await wire.link(this.app, this.incoming, this.outgoing);
  }
}

module.exports = IoPort;
