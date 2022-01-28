'use strict';

const { PassThrough } = require('stream');

const WriteStream = require('./WriteStream');

class Publisher {
  constructor (channel, name) {
    this.channel = channel;
    this.name = name;
  }

  async createWriteStream () {
    await this.channel.assertExchange(this.name, 'fanout', { durable: true });

    return new WriteStream(this.channel, this.name);
  }

  async createReadStream () {
    await this.channel.assertExchange(this.name, 'fanout', { durable: true });

    const ok = await this.channel.assertQueue('', { autoDelete: true, exclusive: true });
    const generatedQueueName = ok.queue;

    await this.channel.bindQueue(generatedQueueName, this.name, '', {});

    const readStream = new PassThrough({ objectMode: true });

    await this.channel.consume(generatedQueueName, message => {
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

module.exports = Publisher;
