'use strict';

const oneLine = require('common-tags/lib/oneLine'),
      shell = require('shelljs');

const waitForRabbitMq = require('../shared/waitForRabbitMq');

const pre = async function () {
  shell.exec(oneLine`
    docker run
      -d
      -p 5672:5672
      -e RABBITMQ_DEFAULT_USER=wolkenkit
      -e RABBITMQ_DEFAULT_PASS=wolkenkit
      --name rabbitmq
      thenativeweb/wolkenkit-rabbitmq:latest
  `);

  await waitForRabbitMq();
};

module.exports = pre;
