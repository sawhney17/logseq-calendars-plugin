'use strict';

const path = require('path');

const assert = require('assertthat');

const Server = require('../../../../../src/wires/api/http/Server');

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

  test('throws an exception if keys are missing.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Server({ port: 3000 });
      /* eslint-enable no-new */
    }).is.throwing('CORS origin is missing.');
  });

  test('throws if a serveStatic is not a valid path.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Server({
        port: 3000,
        corsOrigin: '*',
        serveStatic: path.join(__dirname, 'unknown-file-or-directory')
      });
      /* eslint-enable no-new */
    }).is.throwing('Serve static is not a valid path.');
  });

  test('throws if serveStatic is not a directory.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Server({
        port: 3000,
        corsOrigin: '*',
        serveStatic: path.join(__dirname, 'ServerTests.js')
      });
      /* eslint-enable no-new */
    }).is.throwing('Serve static is not a directory.');
  });

  test('does not throw if serveStatic is a directory.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Server({
        port: 3000,
        corsOrigin: '*',
        serveStatic: path.join(__dirname)
      });
      /* eslint-enable no-new */
    }).is.not.throwing();
  });
});
