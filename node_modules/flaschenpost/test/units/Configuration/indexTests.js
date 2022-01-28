'use strict';

const os = require('os');

const assert = require('assertthat'),
      nodeenv = require('nodeenv'),
      sinon = require('sinon');

const Configuration = require('../../../src/Configuration'),
      defaultLevels = require('../../../src/defaultLevels.json');

suite('Configuration', () => {
  test('is a function.', done => {
    assert.that(Configuration).is.ofType('function');
    done();
  });

  test('returns an object.', done => {
    assert.that(new Configuration()).is.ofType('object');
    done();
  });

  suite('levels', () => {
    test('is an object.', done => {
      const configuration = new Configuration();

      assert.that(configuration.levels).is.ofType('object');
      done();
    });

    test('contains the default levels.', done => {
      const configuration = new Configuration();

      assert.that(configuration.levels).is.equalTo(defaultLevels);
      done();
    });
  });

  suite('host', () => {
    test('is a string.', done => {
      const configuration = new Configuration();

      assert.that(configuration.host).is.ofType('string');
      done();
    });

    test('contains the host.', done => {
      const configuration = new Configuration();

      assert.that(configuration.host).is.equalTo(os.hostname());
      done();
    });
  });

  suite('set', () => {
    test('is a function.', done => {
      const configuration = new Configuration();

      assert.that(configuration.set).is.ofType('function');
      done();
    });

    test('throws an error when an unknown key is specified.', done => {
      const configuration = new Configuration();

      assert.that(() => {
        configuration.set('foo');
      }).is.throwing('Unknown key \'foo\' specified.');
      done();
    });

    test('calls the appropriate setX function.', done => {
      const configuration = new Configuration(),
            spy = sinon.spy(configuration, 'setLevels');

      const expected = {
        info: {
          color: 'green',
          enabled: true
        }
      };

      configuration.set('levels', expected);

      assert.that(spy.calledOnce).is.true();
      assert.that(spy.calledWith(expected)).is.true();

      configuration.setLevels.restore();
      done();
    });
  });

  suite('setLevels', () => {
    test('is a function.', done => {
      const configuration = new Configuration();

      assert.that(configuration.setLevels).is.ofType('function');
      done();
    });

    test('throws an error if levels are missing.', done => {
      const configuration = new Configuration();

      assert.that(() => {
        configuration.setLevels();
      }).is.throwing('Levels are missing.');
      done();
    });

    test('sets the given levels.', done => {
      const expected = {
        info: {
          color: 'green',
          enabled: true
        }
      };

      const configuration = new Configuration();

      configuration.setLevels(expected);

      assert.that(configuration.levels).is.equalTo(expected);
      done();
    });

    test('sets the given levels with respect to the LOG_LEVELS environment variable.', done => {
      const restore = nodeenv('LOG_LEVELS', 'debug');

      const input = {
        debug: {
          color: 'green',
          enabled: false
        }
      };

      const expected = {
        debug: {
          color: 'green',
          enabled: true
        }
      };

      const configuration = new Configuration();

      configuration.setLevels(input);

      assert.that(configuration.levels).is.equalTo(expected);
      restore();
      done();
    });

    test('throws an error if an unknown level is provided by the LOG_LEVELS environment variable.', done => {
      const restore = nodeenv('LOG_LEVELS', 'foobar');

      assert.that(() => {
        /* eslint-disable no-new */
        new Configuration();
        /* eslint-enable no-new */
      }).is.throwing('Unknown log level foobar.');

      restore();
      done();
    });

    test('sets all levels if the LOG_LEVELS environment variable contains a \'*\'.', done => {
      const restore = nodeenv('LOG_LEVELS', '*');

      const input = {
        debug: {
          color: 'green',
          enabled: false
        },
        info: {
          color: 'white',
          enabled: false
        }
      };

      const expected = {
        debug: {
          color: 'green',
          enabled: true
        },
        info: {
          color: 'white',
          enabled: true
        }
      };

      const configuration = new Configuration();

      configuration.setLevels(input);

      assert.that(configuration.levels).is.equalTo(expected);
      restore();
      done();
    });
  });

  suite('setHost', () => {
    test('is a function.', done => {
      const configuration = new Configuration();

      assert.that(configuration.setHost).is.ofType('function');
      done();
    });

    test('throws an error if host is missing.', done => {
      const configuration = new Configuration();

      assert.that(() => {
        configuration.setHost();
      }).is.throwing('Host is missing.');
      done();
    });

    test('sets the given host.', done => {
      const configuration = new Configuration();

      configuration.setHost('example.com');

      assert.that(configuration.host).is.equalTo('example.com');
      done();
    });
  });
});
