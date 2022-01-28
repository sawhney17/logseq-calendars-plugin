'use strict';

const assert = require('assertthat');

const sanitize = require('../../../src/letter/sanitizeMetadata');

suite('sanitizeMetadata', () => {
  test('does nothing to normal objects.', done => {
    const actual = sanitize({
      foo: 'bar'
    });

    assert.that(actual).is.equalTo({
      foo: 'bar'
    });
    done();
  });

  test('preserves arrays.', done => {
    const actual = sanitize({
      foo: [ 'bar' ]
    });

    assert.that(actual).is.equalTo({
      foo: [ 'bar' ]
    });
    done();
  });

  test('converts error objects to normal ones.', done => {
    const actual = sanitize(new Error('foo'));

    assert.that(actual).is.ofType('object');
    assert.that(actual.name).is.equalTo('Error');
    assert.that(actual.message).is.equalTo('foo');
    assert.that(actual.stack).is.ofType('string');
    done();
  });

  test('converts objects that contain error objects.', done => {
    const actual = sanitize({
      error: new Error('foo'),
      data: 'bar'
    });

    assert.that(actual).is.ofType('object');
    assert.that(actual.error).is.ofType('object');
    assert.that(actual.error.name).is.equalTo('Error');
    assert.that(actual.error.message).is.equalTo('foo');
    assert.that(actual.error.stack).is.ofType('string');
    assert.that(actual.data).is.equalTo('bar');
    done();
  });

  test('converts recursive objects and replaces the recursive part with null.', done => {
    const recursive = {
      foo: 'bar'
    };

    recursive.bar = recursive;

    const actual = sanitize(recursive);

    assert.that(actual).is.ofType('object');
    assert.that(actual.foo).is.equalTo('bar');
    assert.that(actual.bar).is.null();
    done();
  });

  test('ignores non-objects on recursion check.', done => {
    const recursive = {
      foo: 'bar',
      bar: {
        foo: 'bar'
      }
    };

    const actual = sanitize(recursive);

    assert.that(actual).is.equalTo({
      foo: 'bar',
      bar: {
        foo: 'bar'
      }
    });
    done();
  });

  test('returns a copy of the object.', done => {
    const data = {
      foo: 'bar'
    };

    assert.that(sanitize(data)).is.not.sameAs(data);
    done();
  });
});
