'use strict';

const assert = require('assertthat');

const objectFrom = require('../../src/objectFrom');

suite('objectFrom', () => {
  test('is a function.', done => {
    assert.that(objectFrom).is.ofType('function');
    done();
  });

  test('returns undefined if no value is given.', done => {
    assert.that(objectFrom({}, false)).is.undefined();
    done();
  });

  test('returns the object itself if an object is given.', done => {
    assert.that(objectFrom({ foo: 23 }, true)).is.equalTo({ foo: 23 });
    done();
  });

  test('returns the wrapper value if an array is given.', done => {
    assert.that(objectFrom([ 23, 42 ], true)).is.equalTo({ value: [ 23, 42 ]});
    done();
  });

  test('returns the wrapped value if no object is given.', done => {
    assert.that(objectFrom(23, true)).is.equalTo({ value: 23 });
    done();
  });

  test('returns the wrapped value even for falsy values.', done => {
    assert.that(objectFrom(0, true)).is.equalTo({ value: 0 });
    done();
  });

  test('returns the wrapped value even for null.', done => {
    assert.that(objectFrom(null, true)).is.equalTo({ value: null });
    done();
  });

  test('returns the wrapped value even for undefined.', done => {
    assert.that(objectFrom(undefined, true)).is.equalTo({ value: undefined });
    done();
  });
});
