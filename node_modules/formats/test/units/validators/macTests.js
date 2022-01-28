'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/mac');

suite('mac', () => {
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

    test('returns false for a non-MAC address.', done => {
      assert.that(validator()('foobar')).is.false();
      done();
    });

    test('returns true for a MAC address with colons.', done => {
      assert.that(validator()('12:34:56:78:9a:cd')).is.true();
      done();
    });

    test('returns true for a MAC address with hyphens.', done => {
      assert.that(validator()('12-34-56-78-9a-cd')).is.true();
      done();
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      assert.that(validator({ default: '00:00:00:00:00:00' })('12:34:56:78:9a:cd')).is.equalTo('12:34:56:78:9a:cd');
      done();
    });

    test('returns the default value if not valid.', done => {
      assert.that(validator({ default: '00:00:00:00:00:00' })('foobar')).is.equalTo('00:00:00:00:00:00');
      done();
    });
  });
});
