'use strict';

const sendMessage = require('./wsSendMessage'),
      validateQuery = require('./validateQuery');

const subscriptions = {};

const postRead = {
  async subscribe (socket, { app, message, readModel }) {
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

    const logger = app.services.getLogger();

    if (!message.payload) {
      try {
        await sendMessage(socket, { type: 'error', payload: 'Payload is missing.', statusCode: 400, procedureId: message.procedureId });
      } catch (ex) {
        logger.error('Failed to send message.', { ex });
      }

      return;
    }

    const { modelName, modelType, query = {}} = message.payload;
    const { orderBy = {}} = query;
    let { skip = 0, take = 100, where = {}} = query;

    if (typeof skip !== 'number') {
      skip = 0;
    }
    if (typeof take !== 'number') {
      take = 100;
    }

    if (!readModel[modelType]) {
      try {
        await sendMessage(socket, { type: 'error', payload: 'Unknown model type.', statusCode: 400, procedureId: message.procedureId });
      } catch (ex) {
        logger.error('Failed to send message.', { ex });
      }

      return;
    }

    if (!readModel[modelType][modelName]) {
      try {
        await sendMessage(socket, { type: 'error', payload: 'Unknown model name.', statusCode: 400, procedureId: message.procedureId });
      } catch (ex) {
        logger.error('Failed to send message.', { ex });
      }

      return;
    }

    try {
      validateQuery({ orderBy, skip, take, where });
    } catch (ex) {
      try {
        await sendMessage(socket, { type: 'error', payload: 'Invalid query.', statusCode: 400, procedureId: message.procedureId });
      } catch (exSendMessage) {
        logger.error('Failed to send message.', { exSendMessage });
      }

      return;
    }

    const authenticationWhere = [
      { 'isAuthorized.owner': message.token.sub },
      { 'isAuthorized.forPublic': true }
    ];

    if (message.token.sub !== 'anonymous') {
      authenticationWhere.push({ 'isAuthorized.forAuthenticated': true });
    }

    where = {
      $and: [ where, { $or: authenticationWhere }]
    };

    let stream;

    try {
      stream = await app.api.read(modelType, modelName, {
        where,
        orderBy,
        take,
        skip,
        user: {
          id: message.token.sub,
          token: message.token
        }
      });
    } catch (ex) {
      try {
        await sendMessage(socket, { type: 'error', payload: 'Unable to load model.', statusCode: 500, procedureId: message.procedureId });
      } catch (exSendMessage) {
        logger.error('Failed to send message.', { exSendMessage });
      }

      return;
    }

    let onData,
        onEnd,
        onError;

    const unsubscribe = function () {
      stream.removeListener('data', onData);
      stream.removeListener('end', onEnd);
      stream.removeListener('error', onError);
      stream.end();
    };

    subscriptions[socket.uniqueId] = subscriptions[socket.uniqueId] || {};
    subscriptions[socket.uniqueId][message.procedureId] = unsubscribe;

    onData = function (data) {
      (async () => {
        try {
          await sendMessage(socket, { type: 'item', payload: data, statusCode: 200, procedureId: message.procedureId });
        } catch (ex) {
          logger.error('Failed to send message.', { ex });
        }
      })();
    };

    onEnd = function () {
      unsubscribe();
      (async () => {
        try {
          await sendMessage(socket, { type: 'finish', statusCode: 200, procedureId: message.procedureId });
        } catch (ex) {
          logger.error('Failed to send message.', { ex });
        }
      })();
    };

    onError = function (err) {
      unsubscribe();
      (async () => {
        try {
          await sendMessage(socket, { type: 'error', statusCode: 500, procedureId: message.procedureId, payload: err });
        } catch (ex) {
          logger.error('Failed to send message.', { ex });
        }
      })();
    };

    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onError);

    try {
      await sendMessage(socket, { type: 'subscribedRead', statusCode: 200, procedureId: message.procedureId });
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
      await sendMessage(socket, { type: 'unsubscribedRead', statusCode: 200, procedureId: message.procedureId });
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

module.exports = postRead;
