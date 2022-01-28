'use strict';

const assert = require('assertthat');

const Server = require('../../../../../src/wires/status/http/Server');

suite('Server', () => {
  test('is a function.', async () => {
    assert.that(Server).is.ofType('function');
  });

  test('throws an exception if port is missing.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Server({});
      /* eslint-enable no-new */
    }).is.throwing('Port is missing.');
  });

  test('throws an exception if CORS origin is missing.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Server({ port: 3000 });
      /* eslint-enable no-new */
    }).is.throwing('CORS origin is missing.');
  });
});
