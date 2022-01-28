'use strict';

const stream = require('stream');

const assert = require('assertthat');

const Gelf = require('../../../src/formatters/Gelf');

const Transform = stream.Transform;

suite('Gelf', () => {
  let gelf;

  const paragraph = {
    host: 'example.com',
    pid: 82517,
    id: 0,
    timestamp: 1415024939974,
    level: 'info',
    message: 'App started.',
    module: { name: 'foo', version: '0.0.1' },
    source: 'app.js',
    metadata: { foo: 'bar' }
  };

  suiteSetup(() => {
    gelf = new Gelf();
  });

  test('is a transform stream.', done => {
    assert.that(gelf).is.instanceOf(Transform);
    done();
  });

  test('transforms a paragraph to a GELF string.', done => {
    gelf.once('data', data => {
      assert.that(data).is.ofType('string');
      done();
    });

    gelf.write(paragraph);
  });

  test('prefixes the non-standard keys.', done => {
    gelf.once('data', data => {
      /* eslint-disable no-underscore-dangle */
      const gelfObject = JSON.parse(data);

      // Standard keys
      assert.that(gelfObject.host).is.not.undefined();
      assert.that(gelfObject.level).is.not.undefined();
      assert.that(gelfObject.timestamp).is.not.undefined();

      // Non-standard keys
      assert.that(gelfObject.id).is.undefined();
      assert.that(gelfObject._id).is.not.undefined();
      assert.that(gelfObject.source).is.undefined();
      assert.that(gelfObject._source).is.not.undefined();
      assert.that(gelfObject.metadata).is.undefined();
      assert.that(gelfObject._metadata).is.not.undefined();

      done();
      /* eslint-enable no-underscore-dangle */
    });

    gelf.write(paragraph);
  });

  test('inserts required key(s).', done => {
    gelf.once('data', data => {
      const gelfObject = JSON.parse(data);

      assert.that(gelfObject.version).is.equalTo('1.1');
      done();
    });

    gelf.write(paragraph);
  });

  test('maps the flaschenpost keys.', done => {
    gelf.once('data', data => {
      const gelfObject = JSON.parse(data);

      assert.that(gelfObject.short_message).is.equalTo(paragraph.message);
      done();
    });

    gelf.write(paragraph);
  });
});
