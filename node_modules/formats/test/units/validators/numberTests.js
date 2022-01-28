'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/number');

suite('number', () => {
  test('is a function.', done => {
    assert.that(validator).is.ofType('function');
    done();
  });

  test('returns a function.', done => {
    assert.that(validator()).is.ofType('function');
    done();
  });

  test('throws on unknown properties.', done => {
    assert.that(() => {
      validator({ nonExistent: 'foobar' });
    }).is.throwing('Unknown property nonExistent.');
    done();
  });

  suite('basics', () => {
    test('returns false for a non-number.', done => {
      assert.that(validator()('foo')).is.false();
      done();
    });

    test('returns true for a number.', done => {
      assert.that(validator()(23)).is.true();
      done();
    });

    test('returns true for 0.', done => {
      assert.that(validator()(0)).is.true();
      done();
    });

    suite('isInteger', () => {
      test('returns false for a decimal number.', done => {
        assert.that(validator({ isInteger: true })(3.7)).is.false();
        done();
      });

      test('returns true for an integer number.', done => {
        assert.that(validator({ isInteger: true })(7)).is.true();
        done();
      });
    });

    suite('min', () => {
      test('returns false for a too small number.', done => {
        assert.that(validator({ min: 5 })(3)).is.false();
        done();
      });

      test('returns true for a number large enough.', done => {
        assert.that(validator({ min: 5 })(7)).is.true();
        done();
      });
    });

    suite('max', () => {
      test('returns false for a too large number.', done => {
        assert.that(validator({ max: 5 })(7)).is.false();
        done();
      });

      test('returns true for a number small enough.', done => {
        assert.that(validator({ max: 5 })(3)).is.true();
        done();
      });
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      assert.that(validator({ default: 42 })(23)).is.equalTo(23);
      done();
    });

    test('returns the default value if not valid.', done => {
      assert.that(validator({ default: 42 })('foo')).is.equalTo(42);
      done();
    });
  });
});
