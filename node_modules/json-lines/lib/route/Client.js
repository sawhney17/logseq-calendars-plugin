'use strict';

const { EventEmitter } = require('events');

class Client extends EventEmitter {
  constructor (req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  send (data) {
    if (typeof data !== 'object') {
      throw new Error('Data must be an object.');
    }
    if (data === null) {
      throw new Error('Data must not be null.');
    }

    try {
      this.res.write(`${JSON.stringify(data)}\n`);
    } catch (ex) {
      if (ex.message === 'write after end') {
        // Ignore write after end errors. This simply means that the connection
        // was closed concurrently, and we can't do anything about it anyway.
        // Hence, simply return.
        return;
      }
      throw ex;
    }
  }

  disconnect () {
    this.res.end();
    this.res.removeAllListeners();
  }
}

module.exports = Client;
