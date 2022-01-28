'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/boolean');

suite('boolean', () => {
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
    test('returns false for a non-boolean.', done => {
      assert.that(validator()('foo')).is.false();
      done();
    });

    test('returns true for true.', done => {
      assert.that(validator()(true)).is.true();
      done();
    });

    test('returns true for false.', done => {
      assert.that(validator()(true)).is.true();
      done();
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      assert.that(validator({ default: true })(false)).is.false();
      done();
    });

    test('returns the default value if not valid.', done => {
      assert.that(validator({ default: true })(23)).is.true();
      done();
    });
  });
});
