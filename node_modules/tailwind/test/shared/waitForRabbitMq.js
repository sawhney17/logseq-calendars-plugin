'use strict';

const amqp = require('amqplib'),
      retry = require('async-retry');

const waitForRabbitMq = async function () {
  await retry(async () => {
    const connection = await amqp.connect('amqp://wolkenkit:wolkenkit@localhost:5672', {});

    await connection.close();
  });
};

module.exports = waitForRabbitMq;
