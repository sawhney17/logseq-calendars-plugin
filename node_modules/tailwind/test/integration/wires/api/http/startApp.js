'use strict';

const path = require('path');

const tailwind = require('../../../../../src/tailwind');

const startApp = async function ({ port, corsOrigin, serveStatic }) {
  const app = tailwind.createApp({
    identityProviders: [
      {
        issuer: 'https://auth.thenativeweb.io',
        certificate: path.join(__dirname, '..', '..', '..', '..', 'shared', 'keys', 'certificate.pem')
      }
    ]
  });

  await app.api.use(new app.wires.api.http.Server({
    keys: path.join(__dirname, '..', '..', '..', '..', 'shared', 'keys'),
    port,
    corsOrigin,
    serveStatic,
    writeModel: {
      network: {
        node: {
          commands: { ping: {}},
          events: { pinged: {}}
        }
      }
    },
    readModel: {
      lists: { pings: {}}
    }
  }));

  return app;
};

module.exports = startApp;
