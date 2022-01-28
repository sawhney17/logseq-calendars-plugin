'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/function');

suite('function', () => {
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
    test('returns false for a non-function.', done => {
      assert.that(validator()('foo')).is.false();
      done();
    });

    test('returns true for a function.', done => {
      assert.that(validator()(() => {
        // Intentionally left blank.
      })).is.true();
      done();
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      const defaultFunction = () => 42;
      const inputFunction = () => 23;

      assert.that(validator({ default: defaultFunction })(inputFunction)).is.equalTo(inputFunction);
      done();
    });

    test('returns the default value if not valid.', done => {
      const defaultFunction = () => 23;

      assert.that(validator({ default: defaultFunction })(23)).is.equalTo(defaultFunction);
      done();
    });
  });
});
