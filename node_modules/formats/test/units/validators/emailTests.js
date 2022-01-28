'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/email');

suite('email', () => {
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

    test('returns false for a non-email.', done => {
      assert.that(validator()('')).is.false();
      done();
    });

    test('returns true for an email.', done => {
      assert.that(validator()('jane.doe@example.com')).is.true();
      done();
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      assert.that(validator({ default: 'jane.doe@example.com' })('john.doe@example.com')).is.equalTo('john.doe@example.com');
      done();
    });

    test('returns the default value if not valid.', done => {
      assert.that(validator({ default: 'jane.doe@example.com' })(23)).is.equalTo('jane.doe@example.com');
      done();
    });
  });
});
