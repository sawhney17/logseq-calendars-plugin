'use strict';

const { PassThrough } = require('stream');

const WriteStream = require('./WriteStream');

class Worker {
  constructor (channel, name) {
    this.channel = channel;
    this.name = name;
  }

  async createWriteStream () {
    await this.channel.assertExchange(this.name, 'direct', { durable: true });
    await this.channel.assertQueue(this.name, { durable: true });
    await this.channel.bindQueue(this.name, this.name, '', {});

    return new WriteStream(this.channel, this.name);
  }

  async createReadStream () {
    await this.channel.assertExchange(this.name, 'direct', { durable: true });
    await this.channel.assertQueue(this.name, { durable: true });
    await this.channel.bindQueue(this.name, this.name, '', {});

    const readStream = new PassThrough({ objectMode: true });

    await this.channel.consume(this.name, message => {
      const parsedMessage = {};

      parsedMessage.payload = JSON.parse(message.content.toString('utf8'));

      parsedMessage.next = () => {
        this.channel.ack(message);
      };

      parsedMessage.discard = () => {
        this.channel.nack(message, false, false);
      };

      parsedMessage.defer = () => {
        this.channel.nack(message, false, true);
      };

      readStream.write(parsedMessage);
    }, {});

    return readStream;
  }
}

module.exports = Worker;
