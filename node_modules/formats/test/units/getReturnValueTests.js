'use strict';

const assert = require('assertthat');

const getReturnValue = require('../../lib/getReturnValue');

suite('getReturnValue', () => {
  test('is a function.', done => {
    assert.that(getReturnValue).is.ofType('function');
    done();
  });

  test('returns a boolean object if options.default is missing.', done => {
    assert.that(getReturnValue(23)).is.equalTo({
      true: true,
      false: false
    });
    done();
  });

  test('returns a value object if options.default is given.', done => {
    assert.that(getReturnValue(23, { default: 42 })).is.equalTo({
      true: 23,
      false: 42
    });
    done();
  });
});
