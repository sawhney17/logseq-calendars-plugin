'use strict';

const { EventEmitter } = require('events');

const getRandom = require('./getRandom');

class Timer extends EventEmitter {
  constructor (timeout, options = {}) {
    if (timeout === undefined) {
      throw new Error('Timeout is missing.');
    }

    super();

    const { immediate, variation } = options;

    this.timeout = timeout;
    this.timer = undefined;

    this.isRunning = false;

    this.immediate = Boolean(immediate);
    this.variation = variation || 0;

    if (this.immediate) {
      this.tick();
    }

    this.start();
  }

  tick () {
    const timeout = this.timeout + getRandom(0 - this.variation, this.variation);

    process.nextTick(() => {
      this.emit('tick');
    });

    this.timer = setTimeout(() => {
      this.tick();
    }, timeout);
  }

  start () {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.timer = setTimeout(() => {
      this.tick();
    }, this.timeout);
  }

  stop () {
    this.isRunning = false;
    clearTimeout(this.timer);
  }

  destroy () {
    this.stop();
    this.removeAllListeners();
  }
}

module.exports = Timer;
