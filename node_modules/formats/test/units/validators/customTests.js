'use strict';

const assert = require('assertthat');

const getReturnValue = require('../../../lib/getReturnValue'),
      validator = require('../../../lib/validators/custom');

const range = function (options) {
  options = options || {};
  options.min = options.min || Number.NEGATIVE_INFINITY;
  options.max = options.max || Number.POSITIVE_INFINITY;

  return function (value) {
    const returnValue = getReturnValue(value, options);

    if (typeof value !== 'number') {
      return returnValue.false;
    }

    if (value < options.min) {
      return returnValue.false;
    }

    if (value > options.max) {
      return returnValue.false;
    }

    return returnValue.true;
  };
};

suite('custom', () => {
  test('is a function.', done => {
    assert.that(validator).is.ofType('function');
    done();
  });

  test('throws an error if validator is missing.', done => {
    assert.that(() => {
      validator();
    }).is.throwing('Validator is missing.');
    done();
  });

  test('returns a function.', done => {
    assert.that(validator(range({ min: 5, max: 23 }))).is.ofType('function');
    done();
  });

  test('returns the requested validator.', done => {
    const rangeValidator = validator(range({ min: 5, max: 23 }));

    assert.that(rangeValidator(7)).is.true();
    assert.that(rangeValidator(23)).is.true();
    assert.that(rangeValidator(42)).is.false();
    done();
  });

  test('returns the requested validator with default option.', done => {
    const rangeValidator = validator(range({ min: 5, max: 23, default: 7 }));

    assert.that(rangeValidator(7)).is.equalTo(7);
    assert.that(rangeValidator(23)).is.equalTo(23);
    assert.that(rangeValidator(42)).is.equalTo(7);
    done();
  });
});
