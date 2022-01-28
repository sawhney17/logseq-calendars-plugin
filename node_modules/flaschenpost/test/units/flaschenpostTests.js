'use strict';

const assert = require('assertthat');

const flaschenpost = require('../../src/flaschenpost'),
      letter = require('../../src/letter');

suite('flaschenpost', () => {
  setup(() => {
    flaschenpost.initialize();
  });

  test('is an object.', done => {
    assert.that(flaschenpost).is.ofType('object');
    done();
  });

  suite('initialize', () => {
    test('is a function.', done => {
      assert.that(flaschenpost.initialize).is.ofType('function');
      done();
    });
  });

  suite('use', () => {
    test('is a function.', done => {
      assert.that(flaschenpost.use).is.ofType('function');
      done();
    });

    test('throws an error when an unknown key is specified.', done => {
      assert.that(() => {
        flaschenpost.use('foo');
      }).is.throwing('Unknown key \'foo\' specified.');
      done();
    });
  });

  suite('getLogger', () => {
    test('is a function.', done => {
      assert.that(flaschenpost.getLogger).is.ofType('function');
      done();
    });

    test('uses an unknown module if source is not a valid path.', done => {
      const logger = flaschenpost.getLogger('foobar');

      assert.that(logger.module).is.equalTo({
        name: '(unknown)',
        version: '(unknown)'
      });
      done();
    });

    test('uses an unknown module if given path does not have a package.json file.', done => {
      const logger = flaschenpost.getLogger('/');

      assert.that(logger.module).is.equalTo({
        name: '(unknown)',
        version: '(unknown)'
      });
      done();
    });

    test('returns an object.', done => {
      assert.that(flaschenpost.getLogger(__filename)).is.ofType('object');
      done();
    });

    test('has the levels as log functions.', done => {
      const logger = flaschenpost.getLogger(__filename);

      assert.that(logger.fatal).is.ofType('function');
      assert.that(logger.error).is.ofType('function');
      assert.that(logger.warn).is.ofType('function');
      assert.that(logger.info).is.ofType('function');
      assert.that(logger.debug).is.ofType('function');
      done();
    });

    suite('log function', () => {
      test('throws an error when no message is given.', done => {
        const logger = flaschenpost.getLogger(__filename);

        assert.that(() => {
          logger.info();
        }).is.throwing('Message is missing.');
        done();
      });

      test('throws an error when message is not a string.', done => {
        const logger = flaschenpost.getLogger(__filename);

        assert.that(() => {
          logger.info(42);
        }).is.throwing('Message must be a string.');
        done();
      });

      test('writes the message to a letter.', done => {
        flaschenpost.use('host', 'example.com');

        const logger = flaschenpost.getLogger(__filename);

        letter.once('data', paragraph => {
          assert.that(paragraph).is.ofType('object');
          assert.that(paragraph.host).is.equalTo('example.com');
          assert.that(paragraph.pid).is.equalTo(process.pid);
          assert.that(paragraph.id).is.ofType('number');
          assert.that(paragraph.timestamp).is.not.undefined();
          assert.that(paragraph.level).is.equalTo('info');
          assert.that(paragraph.message).is.equalTo('App started.');
          assert.that(paragraph.application.name).is.equalTo('flaschenpost');
          assert.that(paragraph.application.version).is.not.undefined();
          assert.that(paragraph.module).is.equalTo({
            name: 'foo',
            version: '0.0.1'
          });
          assert.that(paragraph.source).is.equalTo(__filename);
          assert.that(paragraph.metadata).is.undefined();
          done();
        });

        logger.info('App started.');
      });

      test('writes the message to a letter with metadata.', done => {
        flaschenpost.use('host', 'example.com');

        const logger = flaschenpost.getLogger(__filename);

        letter.once('data', paragraph => {
          assert.that(paragraph).is.ofType('object');
          assert.that(paragraph.host).is.equalTo('example.com');
          assert.that(paragraph.pid).is.equalTo(process.pid);
          assert.that(paragraph.id).is.ofType('number');
          assert.that(paragraph.timestamp).is.not.undefined();
          assert.that(paragraph.level).is.equalTo('info');
          assert.that(paragraph.message).is.equalTo('App started.');
          assert.that(paragraph.application.name).is.equalTo('flaschenpost');
          assert.that(paragraph.application.version).is.not.undefined();
          assert.that(paragraph.module).is.equalTo({
            name: 'foo',
            version: '0.0.1'
          });
          assert.that(paragraph.source).is.equalTo(__filename);
          assert.that(paragraph.metadata).is.equalTo({
            foo: 'bar',
            metadata: {
              bar: 'baz'
            }
          });
          done();
        });

        logger.info('App started.', {
          foo: 'bar',
          metadata: {
            bar: 'baz'
          }
        });
      });

      test('writes the message to a letter with metadata other than object.', done => {
        flaschenpost.use('host', 'example.com');

        const logger = flaschenpost.getLogger(__filename);

        letter.once('data', paragraph => {
          assert.that(paragraph).is.ofType('object');
          assert.that(paragraph.host).is.equalTo('example.com');
          assert.that(paragraph.pid).is.equalTo(process.pid);
          assert.that(paragraph.id).is.ofType('number');
          assert.that(paragraph.timestamp).is.not.undefined();
          assert.that(paragraph.level).is.equalTo('info');
          assert.that(paragraph.message).is.equalTo('App started.');
          assert.that(paragraph.application.name).is.equalTo('flaschenpost');
          assert.that(paragraph.application.version).is.not.undefined();
          assert.that(paragraph.module).is.equalTo({
            name: 'foo',
            version: '0.0.1'
          });
          assert.that(paragraph.source).is.equalTo(__filename);
          assert.that(paragraph.metadata).is.equalTo({ value: 3000 });
          done();
        });

        logger.info('App started.', 3000);
      });

      test('writes the message to a letter with an error as metadata.', done => {
        flaschenpost.use('host', 'example.com');

        const logger = flaschenpost.getLogger(__filename);

        letter.once('data', paragraph => {
          assert.that(paragraph).is.ofType('object');
          assert.that(paragraph.host).is.equalTo('example.com');
          assert.that(paragraph.pid).is.equalTo(process.pid);
          assert.that(paragraph.id).is.ofType('number');
          assert.that(paragraph.timestamp).is.not.undefined();
          assert.that(paragraph.level).is.equalTo('info');
          assert.that(paragraph.message).is.equalTo('App started.');
          assert.that(paragraph.application.name).is.equalTo('flaschenpost');
          assert.that(paragraph.application.version).is.not.undefined();
          assert.that(paragraph.module).is.equalTo({
            name: 'foo',
            version: '0.0.1'
          });
          assert.that(paragraph.source).is.equalTo(__filename);
          assert.that(paragraph.metadata).is.ofType('object');
          assert.that(paragraph.metadata.name).is.equalTo('Error');
          assert.that(paragraph.metadata.message).is.equalTo('Something went wrong.');
          done();
        });

        logger.info('App started.', new Error('Something went wrong.'));
      });

      test('writes the message to a letter even when no filename was specified.', done => {
        const logger = flaschenpost.getLogger();

        letter.once('data', paragraph => {
          assert.that(paragraph).is.ofType('object');
          assert.that(paragraph.pid).is.equalTo(process.pid);
          assert.that(paragraph.id).is.ofType('number');
          assert.that(paragraph.timestamp).is.not.undefined();
          assert.that(paragraph.level).is.equalTo('info');
          assert.that(paragraph.message).is.equalTo('App started.');
          assert.that(paragraph.module).is.equalTo({
            name: 'foo',
            version: '0.0.1'
          });
          assert.that(paragraph.source).is.equalTo(__filename);
          assert.that(paragraph.metadata).is.equalTo({
            foo: 'bar',
            metadata: {
              bar: 'baz'
            }
          });
          done();
        });

        logger.info('App started.', {
          foo: 'bar',
          metadata: {
            bar: 'baz'
          }
        });
      });

      test('does not write a message if the log level is disabled.', done => {
        const logger = flaschenpost.getLogger(__filename);
        let counter = 0;

        letter.once('data', () => {
          counter += 1;
        });

        logger.debug('App started.');

        setTimeout(() => {
          assert.that(counter).is.equalTo(0);
          done();
        }, 0.1 * 1000);
      });

      suite('debug modules', () => {
        test('writes log level debug if debugging is not restricted to specific modules.', done => {
          flaschenpost.configuration.levels.debug.enabled = true;
          flaschenpost.configuration.debugModules = [];

          const logger = flaschenpost.getLogger(__filename);
          let counter = 0;

          letter.once('data', () => {
            counter += 1;
          });

          logger.debug('App started.');

          setTimeout(() => {
            assert.that(counter).is.equalTo(1);
            done();
          }, 0.1 * 1000);
        });

        test('writes log level debug if debugging is restricted to a single module and the module matches.', done => {
          flaschenpost.configuration.levels.debug.enabled = true;
          flaschenpost.configuration.debugModules = [ 'foo' ];

          const logger = flaschenpost.getLogger(__filename);
          let counter = 0;

          letter.once('data', () => {
            counter += 1;
          });

          logger.debug('App started.');

          setTimeout(() => {
            assert.that(counter).is.equalTo(1);
            done();
          }, 0.1 * 1000);
        });

        test('does not write log level debug if debugging is restricted to a single module and the module does not match.', done => {
          flaschenpost.configuration.levels.debug.enabled = true;
          flaschenpost.configuration.debugModules = [ 'bar' ];

          const logger = flaschenpost.getLogger(__filename);
          let counter = 0;

          letter.once('data', () => {
            counter += 1;
          });

          logger.debug('App started.');

          setTimeout(() => {
            assert.that(counter).is.equalTo(0);
            done();
          }, 0.1 * 1000);
        });

        test('writes log level debug if debugging is restricted to multiple modules and the module matches.', done => {
          flaschenpost.configuration.levels.debug.enabled = true;
          flaschenpost.configuration.debugModules = [ 'foo', 'bar' ];

          const logger = flaschenpost.getLogger(__filename);
          let counter = 0;

          letter.once('data', () => {
            counter += 1;
          });

          logger.debug('App started.');

          setTimeout(() => {
            assert.that(counter).is.equalTo(1);
            done();
          }, 0.1 * 1000);
        });

        test('does not write log level debug if debugging is restricted to multiple modules and the module does not match.', done => {
          flaschenpost.configuration.levels.debug.enabled = true;
          flaschenpost.configuration.debugModules = [ 'bar', 'baz' ];

          const logger = flaschenpost.getLogger(__filename);
          let counter = 0;

          letter.once('data', () => {
            counter += 1;
          });

          logger.debug('App started.');

          setTimeout(() => {
            assert.that(counter).is.equalTo(0);
            done();
          }, 0.1 * 1000);
        });
      });
    });
  });
});
