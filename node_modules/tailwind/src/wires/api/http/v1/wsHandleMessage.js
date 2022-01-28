'use strict';

const postCommand = require('./wsPostCommand'),
      postEvents = require('./wsPostEvents'),
      postRead = require('./wsPostRead'),
      sendMessage = require('./wsSendMessage');

const handleMessage = async function (socket, { app, message, readModel, writeModel }) {
  if (!socket) {
    throw new Error('Socket is missing.');
  }
  if (!app) {
    throw new Error('App is missing.');
  }
  if (!message) {
    throw new Error('Message is missing.');
  }
  if (!readModel) {
    throw new Error('Read model is missing.');
  }
  if (!writeModel) {
    throw new Error('Write model is missing.');
  }

  const logger = app.services.getLogger();

  switch (message.type) {
    case 'sendCommand': {
      await postCommand.send(socket, { app, message, writeModel });
      break;
    }
    case 'subscribeEvents': {
      await postEvents.subscribe(socket, { app, message });
      break;
    }
    case 'unsubscribeEvents': {
      await postEvents.unsubscribe(socket, { app, message });
      break;
    }
    case 'subscribeRead': {
      await postRead.subscribe(socket, { app, message, readModel });
      break;
    }
    case 'unsubscribeRead': {
      await postRead.unsubscribe(socket, { app, message });
      break;
    }
    default: {
      try {
        await sendMessage(socket, { type: 'error', statusCode: 400, payload: 'Bad request.' });
      } catch (ex) {
        logger.error('Failed to send message.', { ex });
      }
    }
  }
};

module.exports = handleMessage;
