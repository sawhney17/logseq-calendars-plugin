'use strict';

const path = require('path'),
      stream = require('stream');

const assert = require('assertthat');

const Custom = require('../../../src/formatters/Custom');

const Transform = stream.Transform;

suite('Custom', () => {
  let custom;

  suiteSetup(() => {
    custom = new Custom({ js: path.join(__dirname, 'sampleFormatter.js') });
  });

  test('is a transform stream.', done => {
    assert.that(custom).is.instanceOf(Transform);
    done();
  });

  test('throws an error if options are missing.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Custom();
      /* eslint-enable no-new */
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if JavaScript is missing.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Custom({});
      /* eslint-enable no-new */
    }).is.throwing('JavaScript is missing.');
    done();
  });

  test('transforms a paragraph to a human-readable string using the given file.', done => {
    const paragraph = {
      host: 'example.com',
      pid: 82517,
      id: 0,
      timestamp: 1415024939974,
      level: 'info',
      message: 'App started.',
      application: {
        name: 'app',
        version: '1.2.3'
      },
      module: {
        name: 'foo',
        version: '0.0.1'
      },
      source: 'app.js',
      metadata: {
        foo: 'bar'
      }
    };

    custom.once('data', data => {
      assert.that(data).is.equalTo('info  App started.');
      done();
    });

    custom.write(paragraph);
  });
});
