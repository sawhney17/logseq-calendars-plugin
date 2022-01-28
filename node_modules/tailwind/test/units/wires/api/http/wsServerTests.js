'use strict';

const assert = require('assertthat');

const wsServer = require('../../../../../src/wires/api/http/wsServer');

suite('wsServer', () => {
  test('is a function.', async () => {
    assert.that(wsServer).is.ofType('function');
  });

  test('throws an exception if app is missing.', async () => {
    assert.that(() => {
      wsServer({});
    }).is.throwing('App is missing.');
  });

  test('throws an exception if HTTP server is missing.', async () => {
    assert.that(() => {
      wsServer({ app: {}});
    }).is.throwing('Http server is missing.');
  });

  test('throws an exception if read model is missing.', async () => {
    assert.that(() => {
      wsServer({ app: {}, httpServer: {}});
    }).is.throwing('Read model is missing.');
  });

  test('throws an exception if write model is missing.', async () => {
    assert.that(() => {
      wsServer({ app: {}, httpServer: {}, readModel: {}});
    }).is.throwing('Write model is missing.');
  });
});
