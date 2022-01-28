'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/string');

suite('string', () => {
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
    test('returns false for a non-string.', done => {
      assert.that(validator()(23)).is.false();
      done();
    });

    test('returns true for a string.', done => {
      assert.that(validator()('foo')).is.true();
      done();
    });

    test('returns true for an empty string.', done => {
      assert.that(validator()('')).is.true();
      done();
    });

    suite('minLength', () => {
      test('returns false for a too short string.', done => {
        assert.that(validator({ minLength: 5 })('foo')).is.false();
        done();
      });

      test('returns true for a string long enough.', done => {
        assert.that(validator({ minLength: 5 })('foobar')).is.true();
        done();
      });
    });

    suite('maxLength', () => {
      test('returns false for a too long string.', done => {
        assert.that(validator({ maxLength: 5 })('foobar')).is.false();
        done();
      });

      test('returns true for a string short enough.', done => {
        assert.that(validator({ maxLength: 5 })('foo')).is.true();
        done();
      });
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      assert.that(validator({ default: 'bar' })('foo')).is.equalTo('foo');
      done();
    });

    test('returns the default value if not valid.', done => {
      assert.that(validator({ default: 'bar' })(23)).is.equalTo('bar');
      done();
    });
  });
});
