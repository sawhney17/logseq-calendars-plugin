'use strict';

const Limes = require('limes'),
      uuid = require('uuidv4'),
      WebSocket = require('ws');

const v1 = require('./v1/wsIndex');

const wsServer = function ({ app, httpServer, readModel, writeModel }) {
  if (!app) {
    throw new Error('App is missing.');
  }
  if (!httpServer) {
    throw new Error('Http server is missing.');
  }
  if (!readModel) {
    throw new Error('Read model is missing.');
  }
  if (!writeModel) {
    throw new Error('Write model is missing.');
  }

  const logger = app.services.getLogger();

  const webSocketServer = new WebSocket.Server({ server: httpServer });
  const limes = new Limes({ identityProviders: app.identityProviders });

  webSocketServer.on('connection', socket => {
    // Currently, sockets do not have a unique identifier. That's why we make up
    // our own here. To avoid overwriting a future uniqueId property we have an
    // additional sanity check here.
    if (socket.uniqueId) {
      throw new Error('Sockets now have a uniqueId property by default.');
    }
    socket.uniqueId = uuid();

    const onMessage = async function (data) {
      let message;

      try {
        message = JSON.parse(data);
      } catch (ex) {
        // As we could not parse the message sent by the client, we can not
        // dynamically decide which API version to use, so stick to V1 as
        // default here.
        try {
          await v1.sendMessage(socket, { type: 'error', statusCode: 400, payload: 'Bad request.' });
        } catch (exSendMessage) {
          logger.error('Failed to send message.', { exSendMessage });
        }

        return;
      }

      let api;

      switch (message.version) {
        case 'v1': {
          api = v1;
          break;
        }
        default: {
          // As we do not get a valid version from the client, we can not
          // dynamically decide which API version to use, so stick to V1 as
          // default here.
          try {
            await v1.sendMessage(socket, { type: 'error', statusCode: 400, payload: 'Bad request.' });
          } catch (ex) {
            logger.error('Failed to send message.', { ex });
          }

          return;
        }
      }

      if (!message.procedureId) {
        try {
          await api.sendMessage(socket, { type: 'error', statusCode: 400, payload: 'Procedure id is missing.' });
        } catch (ex) {
          logger.error('Failed to send message.', { ex });
        }

        return;
      }

      if (!uuid.is(message.procedureId)) {
        try {
          await api.sendMessage(socket, { type: 'error', statusCode: 400, payload: 'Procedure id is invalid.' });
        } catch (ex) {
          logger.error('Failed to send message.', { ex });
        }

        return;
      }

      if (!message.token) {
        message.token = Limes.issueUntrustedTokenAsJson({
          // According to RFC 2606, .invalid is a reserved TLD you can use in
          // cases where you want to show that a domain is invalid. Since the
          // tokens issued for anonymous users are made-up, https://token.invalid
          // makes up a valid url, but we are sure that we do not run into any
          // conflicts with the domain.
          issuer: 'https://token.invalid',
          subject: 'anonymous'
        });

        await api.handleMessage(socket, { app, message, readModel, writeModel });
      } else {
        let decodedToken;

        try {
          decodedToken = await limes.verifyToken({ token: message.token });
        } catch (ex) {
          try {
            await api.sendMessage(socket, { type: 'error', statusCode: 401, payload: 'Invalid token.', procedureId: message.procedureId });
          } catch (exSendMessage) {
            logger.error('Failed to send message.', { exSendMessage });
          }

          return;
        }

        message.token = decodedToken;

        await api.handleMessage(socket, { app, message, readModel, writeModel });
      }
    };

    const onClose = function () {
      v1.postEvents.removeAllListenersFor(socket);
      v1.postRead.removeAllListenersFor(socket);

      socket.removeEventListener('message', onMessage);
      socket.removeEventListener('close', onClose);
    };

    socket.on('close', onClose);
    socket.on('message', onMessage);
  });
};

module.exports = wsServer;
