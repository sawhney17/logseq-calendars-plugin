'use strict';

const assert = require('assertthat'),
      needle = require('needle');

const startApp = require('./startApp');

suite('Server', () => {
  suite('routes', () => {
    suiteSetup(async () => {
      await startApp({ port: 3007, corsOrigin: '*' });
    });

    test('delivers the correct CORS headers.', async () => {
      const corsOrigins = {
        3008: {
          origin: 'http://www.thenativeweb.io',
          allow: '*',
          expected: '*'
        },
        3009: {
          origin: 'http://www.thenativeweb.io',
          allow: 'http://www.thenativeweb.io',
          expected: 'http://www.thenativeweb.io'
        },
        3010: {
          origin: 'http://www.thenativeweb.io',
          allow: /\.thenativeweb\.io$/,
          expected: 'http://www.thenativeweb.io'
        },
        3011: {
          origin: 'http://www.example.com',
          allow: /\.thenativeweb\.io$/,
          expected: undefined
        },
        3012: {
          origin: 'http://www.thenativeweb.io',
          allow: [ 'http://www.thenativeweb.io', 'http://www.example.com' ],
          expected: 'http://www.thenativeweb.io'
        },
        3013: {
          origin: 'http://www.example.com',
          allow: 'http://www.thenativeweb.io',
          expected: undefined
        }
      };

      const ports = Object.keys(corsOrigins);

      for (let i = 0; i < ports.length; i++) {
        const port = ports[i];
        const corsOrigin = corsOrigins[port];

        await startApp({ port, corsOrigin: corsOrigin.allow });

        const res = await needle('options', `http://localhost:${port}/v1/ping`, undefined, {
          headers: {
            origin: corsOrigin.origin,
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'X-Requested-With'
          }
        });

        assert.that(res.headers['access-control-allow-origin']).is.equalTo(corsOrigin.expected);
        assert.that(res.headers['access-control-allow-methods']).is.equalTo('GET,POST');
        assert.that(res.statusCode).is.equalTo(200);
      }
    });

    suite('GET /v1/status', () => {
      test('returns 200.', async () => {
        const res = await needle('get', 'http://localhost:3007/v1/status');

        assert.that(res.statusCode).is.equalTo(200);
      });

      test('returns application/json.', async () => {
        const res = await needle('get', 'http://localhost:3007/v1/status');

        assert.that(res.headers['content-type']).is.equalTo('application/json; charset=utf-8');
      });

      test('answers with api version v1.', async () => {
        const res = await needle('get', 'http://localhost:3007/v1/status');

        assert.that(res.body).is.equalTo({ api: 'v1' });
      });
    });
  });
});
