'use strict';

const { EventEmitter2 } = require('eventemitter2');

class Draht extends EventEmitter2 {
  constructor () {
    super({
      delimiter: '::',
      wildcard: true
    });
  }

  emit (...args) {
    process.nextTick(() => super.emit(...args));
  }
}

Draht.instance = new Draht();

module.exports = Draht;
