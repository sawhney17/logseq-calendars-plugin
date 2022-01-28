'use strict';

const assert = require('assertthat'),
      nodeenv = require('nodeenv');

const parseLogLevelsEnvironmentVariable = require('../../../src/Configuration/parseLogLevelsEnvironmentVariable');

suite('parseLogLevelsEnvironmentVariable', () => {
  test('is a function.', done => {
    assert.that(parseLogLevelsEnvironmentVariable).is.ofType('function');
    done();
  });

  test('returns an empty array if the environment variable is not set.', done => {
    const restore = nodeenv('LOG_LEVELS', undefined);

    assert.that(parseLogLevelsEnvironmentVariable()).is.equalTo([]);

    restore();
    done();
  });

  /* eslint-disable max-len */
  test('returns an array with a single value if the environment variable is set to a single value.', done => {
    /* eslint-enable max-len */
    const restore = nodeenv('LOG_LEVELS', 'info');

    assert.that(parseLogLevelsEnvironmentVariable()).is.equalTo([ 'info' ]);

    restore();
    done();
  });

  test('returns an array with a single lowercased and trimmed value.', done => {
    const restore = nodeenv('LOG_LEVELS', '  Info ');

    assert.that(parseLogLevelsEnvironmentVariable()).is.equalTo([ 'info' ]);

    restore();
    done();
  });

  test('returns an array with multiple values.', done => {
    const restore = nodeenv('LOG_LEVELS', '  Info , DEBUG  ,warN  ');

    assert.that(parseLogLevelsEnvironmentVariable()).is.equalTo([ 'info', 'debug', 'warn' ]);

    restore();
    done();
  });
});
