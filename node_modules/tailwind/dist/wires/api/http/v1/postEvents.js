'use strict';

var jsonLines = require('json-lines'),
    partOf = require('partof');

var postEvents = function postEvents(app) {
  return jsonLines(function (client) {
    var filter = client.req.body || {};

    var sendToClient = function sendToClient(event) {
      if (!partOf(filter, event)) {
        return undefined;
      }

      if (!event.metadata.isAuthorized || event.metadata.isAuthorized.forPublic || event.metadata.isAuthorized.forAuthenticated && client.req.user.sub !== 'anonymous' || event.metadata.isAuthorized.owner === client.req.user.sub) {
        return client.send(event);
      }

      return undefined;
    };

    client.once('connect', function () {
      app.api.outgoing.on('data', sendToClient);
    });
    client.once('disconnect', function () {
      app.api.outgoing.removeListener('data', sendToClient);
    });
  });
};

module.exports = postEvents;