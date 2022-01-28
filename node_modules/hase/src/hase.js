'use strict';

const amqp = require('amqplib');

const Mq = require('./Mq');

const hase = {};

hase.connect = async function ({ url, prefetch = 1 } = {}) {
  if (!url) {
    throw new Error('Url is missing.');
  }

  let connection;

  try {
    connection = await amqp.connect(url, {});
  } catch (ex) {
    throw new Error(`Could not connect to ${url}.`);
  }

  const channel = await connection.createChannel();

  channel.prefetch(prefetch);

  return new Mq(connection, channel);
};

module.exports = hase;
