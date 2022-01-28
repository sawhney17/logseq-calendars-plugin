'use strict';

const amqp = require('amqplib'),
      retry = require('async-retry');

const env = require('./env');

const waitForRabbitMq = async function () {
  await retry(async () => {
    const connection = await amqp.connect(env.RABBITMQ_URL, {});

    await connection.close();
  });
};

module.exports = waitForRabbitMq;
