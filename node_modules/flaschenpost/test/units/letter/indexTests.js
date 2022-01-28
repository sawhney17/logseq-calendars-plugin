'use strict';

const stream = require('stream');

const assert = require('assertthat');

const letter = require('../../../src/letter');

const Transform = stream.Transform;

suite('letter', () => {
  test('is a transform stream.', done => {
    assert.that(letter).is.instanceOf(Transform);
    done();
  });

  suite('write', () => {
    test('returns a paragraph.', done => {
      const expected = {
        host: 'example.com',
        level: 'info',
        message: 'App started.',
        application: {
          name: 'app',
          version: '1.2.3'
        },
        module: {
          name: 'foo',
          version: '0.0.1'
        }
      };

      letter.once('data', paragraph => {
        assert.that(paragraph).is.ofType('object');
        assert.that(paragraph.host).is.equalTo(expected.host);
        assert.that(paragraph.pid).is.equalTo(process.pid);
        assert.that(paragraph.id).is.ofType('number');
        assert.that(paragraph.timestamp).is.not.undefined();
        assert.that(paragraph.level).is.equalTo(expected.level);
        assert.that(paragraph.message).is.equalTo(expected.message);
        assert.that(paragraph.application).is.equalTo(expected.application);
        assert.that(paragraph.module).is.equalTo(expected.module);
        assert.that(paragraph.source).is.undefined();
        assert.that(paragraph.metadata).is.undefined();
        done();
      });

      letter.write(expected);
    });

    test('returns a paragraph with source information if they are given.', done => {
      const expected = {
        host: 'example.com',
        level: 'info',
        message: 'App started.',
        source: __filename,
        application: {
          name: 'app',
          version: '1.2.3'
        },
        module: {
          name: 'foo',
          version: '0.0.1'
        }
      };

      letter.once('data', paragraph => {
        assert.that(paragraph.source).is.equalTo(expected.source);
        done();
      });

      letter.write(expected);
    });

    test('returns a paragraph with metadata if they are given.', done => {
      const expected = {
        host: 'example.com',
        level: 'info',
        message: 'App started.',
        metadata: {
          foo: 'bar'
        },
        application: {
          name: 'app',
          version: '1.2.3'
        },
        module: {
          name: 'foo',
          version: '0.0.1'
        }
      };

      letter.once('data', paragraph => {
        assert.that(paragraph.metadata).is.equalTo(expected.metadata);
        done();
      });

      letter.write(expected);
    });

    test('returns a paragraph with metadata with correctly transformed error objects.', done => {
      const expected = {
        host: 'example.com',
        level: 'info',
        message: 'App started.',
        metadata: {
          foo: 'bar',
          err: new Error('foobar')
        },
        application: {
          name: 'app',
          version: '1.2.3'
        },
        module: {
          name: 'foo',
          version: '0.0.1'
        }
      };

      letter.once('data', paragraph => {
        assert.that(paragraph.metadata.err).is.ofType('object');
        assert.that(paragraph.metadata.err).is.not.instanceOf(Error);
        assert.that(paragraph.metadata.err.name).is.equalTo('Error');
        assert.that(paragraph.metadata.err.message).is.equalTo('foobar');
        assert.that(paragraph.metadata.err.stack).is.ofType('string');
        done();
      });

      letter.write(expected);
    });

    test('increments the paragraph id by 1.', done => {
      const input = {
        host: 'example.com',
        level: 'info',
        message: 'App started.',
        application: {
          name: 'app',
          version: '1.2.3'
        },
        module: {
          name: 'foo',
          version: '0.0.1'
        }
      };

      letter.once('data', firstParagraph => {
        const firstId = firstParagraph.id;

        letter.once('data', secondParagraph => {
          const secondId = secondParagraph.id;

          assert.that(firstId).is.lessThan(secondId);
          assert.that(firstId + 1).is.equalTo(secondId);
          done();
        });
      });

      letter.write(input);
      letter.write(input);
    });
  });
});
