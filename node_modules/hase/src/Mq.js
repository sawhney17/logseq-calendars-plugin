'use strict';

const { EventEmitter } = require('events');

const Publisher = require('./publisher'),
      Worker = require('./worker');

class Mq extends EventEmitter {
  constructor (connection, channel) {
    super();

    this.connection = connection;
    this.channel = channel;

    let onClose,
        onError;

    const unsubscribe = () => {
      this.connection.removeListener('close', onClose);
      this.connection.removeListener('error', onError);
      this.channel.removeListener('close', onClose);
      this.channel.removeListener('error', onError);
    };

    onClose = () => {
      unsubscribe();
      this.emit('disconnect');
    };

    onError = () => {
      unsubscribe();
      this.emit('disconnect');
    };

    this.connection.on('close', onClose);
    this.connection.on('error', onError);
    this.channel.on('close', onClose);
    this.channel.on('error', onError);
  }

  worker (name) {
    if (!name) {
      throw new Error('Name is missing.');
    }

    return new Worker(this.channel, name);
  }

  publisher (name) {
    if (!name) {
      throw new Error('Name is missing.');
    }

    return new Publisher(this.channel, name);
  }
}

module.exports = Mq;
