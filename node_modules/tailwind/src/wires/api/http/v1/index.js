'use strict';

const express = require('express'),
      Limes = require('limes');

const getConfigurationJson = require('./getConfigurationJson'),
      getPing = require('./getPing'),
      postCommand = require('./postCommand'),
      postEvents = require('./postEvents'),
      postRead = require('./postRead');

const v1 = function (app, { readModel, writeModel }) {
  const api = express();

  const limes = new Limes({ identityProviders: app.identityProviders });
  const verifyTokenMiddleware = limes.verifyTokenMiddleware({
    // According to RFC 2606, .invalid is a reserved TLD you can use in cases
    // where you want to show that a domain is invalid. Since the tokens issued
    // for anonymous users are made-up, https://token.invalid makes up a valid
    // url, but we are sure that we do not run into any conflicts with the
    // domain.
    issuerForAnonymousTokens: 'https://token.invalid'
  });

  api.get('/ping', getPing());
  api.get('/configuration.json', getConfigurationJson({ readModel, writeModel }));

  api.post('/command', verifyTokenMiddleware, postCommand(app, { writeModel }));
  api.post('/events', verifyTokenMiddleware, postEvents(app));
  api.post('/read/:modelType/:modelName', verifyTokenMiddleware, postRead(app, { readModel }));

  return api;
};

module.exports = v1;
