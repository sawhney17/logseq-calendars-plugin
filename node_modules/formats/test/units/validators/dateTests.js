'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/date');

suite('date', () => {
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
    test('returns false for a non-date.', done => {
      assert.that(validator()('foo')).is.false();
      done();
    });

    test('returns false for an object that is not a date.', done => {
      assert.that(validator()(new Error())).is.false();
      done();
    });

    test('returns true for a date.', done => {
      assert.that(validator()(new Date())).is.true();
      done();
    });

    suite('min', () => {
      test('returns false for a too early date.', done => {
        assert.that(validator({ min: new Date(2015, 0, 1) })(new Date(2014, 11, 31))).is.false();
        done();
      });

      test('returns true for a date late enough.', done => {
        assert.that(validator({ min: new Date(2015, 0, 1) })(new Date(2015, 11, 31))).is.true();
        done();
      });
    });

    suite('max', () => {
      test('returns false for a too late date.', done => {
        assert.that(validator({ max: new Date(2015, 0, 1) })(new Date(2015, 11, 31))).is.false();
        done();
      });

      test('returns true for a date early enough.', done => {
        assert.that(validator({ max: new Date(2015, 0, 1) })(new Date(2014, 11, 31))).is.true();
        done();
      });
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      const now = new Date(),
            past = new Date(20015, 0, 1);

      assert.that(validator({ default: now })(past)).is.equalTo(past);
      done();
    });

    test('returns the default value if not valid.', done => {
      const now = new Date();

      assert.that(validator({ default: now })('foo')).is.equalTo(now);
      done();
    });
  });
});
