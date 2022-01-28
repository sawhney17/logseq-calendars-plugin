'use strict';

const partOf = require('partof');

const sendMessage = require('./wsSendMessage');

const subscriptions = {};

const postEvents = {
  async subscribe (socket, { app, message }) {
    if (!socket) {
      throw new Error('Socket is missing.');
    }
    if (!app) {
      throw new Error('App is missing.');
    }
    if (!message) {
      throw new Error('Message is missing.');
    }

    const logger = app.services.getLogger();

    const filter = message.payload ? message.payload.filter || {} : {};

    const sendToClient = function (event) {
      if (!partOf(filter, event)) {
        return;
      }

      if (
        !event.metadata.isAuthorized ||
        event.metadata.isAuthorized.forPublic ||
        (event.metadata.isAuthorized.forAuthenticated && message.token.sub !== 'anonymous') ||
        (event.metadata.isAuthorized.owner === message.token.sub)
      ) {
        (async () => {
          try {
            await sendMessage(socket, { type: 'event', payload: event, statusCode: 200, procedureId: message.procedureId });
          } catch (ex) {
            logger.error('Failed to send message.', { ex });
          }
        })();
      }
    };

    const unsubscribe = function () {
      app.api.outgoing.removeListener('data', sendToClient);
    };

    subscriptions[socket.uniqueId] = subscriptions[socket.uniqueId] || {};
    subscriptions[socket.uniqueId][message.procedureId] = unsubscribe;

    app.api.outgoing.on('data', sendToClient);
    try {
      await sendMessage(socket, { type: 'subscribedEvents', statusCode: 200, procedureId: message.procedureId });
    } catch (ex) {
      logger.error('Failed to send message.', { ex });
    }
  },

  async unsubscribe (socket, { app, message }) {
    if (!socket) {
      throw new Error('Socket is missing.');
    }
    if (!app) {
      throw new Error('App is missing.');
    }
    if (!message) {
      throw new Error('Message is missing.');
    }

    const logger = app.services.getLogger();

    if (!subscriptions[socket.uniqueId] || !subscriptions[socket.uniqueId][message.procedureId]) {
      return;
    }

    const unsubscribe = subscriptions[socket.uniqueId][message.procedureId];

    unsubscribe();
    try {
      await sendMessage(socket, { type: 'unsubscribedEvents', statusCode: 200, procedureId: message.procedureId });
    } catch (ex) {
      logger.error('Failed to send message.', { ex });
    }
  },

  removeAllListenersFor (socket) {
    if (!socket) {
      throw new Error('Socket is missing.');
    }

    if (!subscriptions[socket.uniqueId]) {
      return;
    }

    Object.keys(subscriptions[socket.uniqueId]).forEach(procedureId => {
      const unsubscribe = subscriptions[socket.uniqueId][procedureId];

      unsubscribe();
    });
  }
};

module.exports = postEvents;
