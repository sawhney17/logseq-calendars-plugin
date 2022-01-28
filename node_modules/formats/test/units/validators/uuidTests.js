'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/uuid');

suite('uuid', () => {
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

    test('returns false for a non-uuid.', done => {
      assert.that(validator()('foobar')).is.false();
      done();
    });

    test('returns true for a uuid.', done => {
      assert.that(validator()('053767b2-470a-4d35-99b6-04afbce30ef9')).is.true();
      done();
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      assert.that(validator({ default: '0b2e1fa1-1fa3-4380-a852-f4619b962411' })('10d3e136-fab2-4249-a4a8-d73a1382f832')).is.equalTo('10d3e136-fab2-4249-a4a8-d73a1382f832');
      done();
    });

    test('returns the default value if not valid.', done => {
      assert.that(validator({ default: '3140232f-4b18-4757-a92f-e143f0683e8a' })(23)).is.equalTo('3140232f-4b18-4757-a92f-e143f0683e8a');
      done();
    });
  });
});
