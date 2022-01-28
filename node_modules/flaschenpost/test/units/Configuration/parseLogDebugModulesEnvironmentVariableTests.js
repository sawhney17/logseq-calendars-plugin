'use strict';

const assert = require('assertthat'),
      nodeenv = require('nodeenv');

const parseLogDebugModulesEnvironmentVariable = require('../../../src/Configuration/parseLogDebugModulesEnvironmentVariable');

suite('parseLogDebugModulesEnvironmentVariable', () => {
  test('is a function.', done => {
    assert.that(parseLogDebugModulesEnvironmentVariable).is.ofType('function');
    done();
  });

  test('returns an empty array if the environment variable is not set.', done => {
    const restore = nodeenv('LOG_DEBUG_MODULES', undefined);

    assert.that(parseLogDebugModulesEnvironmentVariable()).is.equalTo([]);

    restore();
    done();
  });

  test('returns an array with a single value if the environment variable is set to a single value.', done => {
    const restore = nodeenv('LOG_DEBUG_MODULES', 'module1');

    assert.that(parseLogDebugModulesEnvironmentVariable()).is.equalTo([
      'module1'
    ]);

    restore();
    done();
  });

  test('returns an array with multiple values.', done => {
    const restore = nodeenv('LOG_DEBUG_MODULES', 'module1,@scoped/module2');

    assert.that(parseLogDebugModulesEnvironmentVariable()).is.equalTo([
      'module1',
      '@scoped/module2'
    ]);

    restore();
    done();
  });
});
