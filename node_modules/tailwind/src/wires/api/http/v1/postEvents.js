'use strict';

const jsonLines = require('json-lines'),
      partOf = require('partof');

const postEvents = function (app) {
  return jsonLines(client => {
    const filter = client.req.body || {};

    const sendToClient = function (event) {
      if (!partOf(filter, event)) {
        return undefined;
      }

      if (
        !event.metadata.isAuthorized ||
        event.metadata.isAuthorized.forPublic ||
        (event.metadata.isAuthorized.forAuthenticated && client.req.user.sub !== 'anonymous') ||
        (event.metadata.isAuthorized.owner === client.req.user.sub)
      ) {
        return client.send(event);
      }

      return undefined;
    };

    client.once('connect', () => {
      app.api.outgoing.on('data', sendToClient);
    });

    client.once('disconnect', () => {
      app.api.outgoing.removeListener('data', sendToClient);
    });
  });
};

module.exports = postEvents;
