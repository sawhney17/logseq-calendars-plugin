'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/ip');

suite('ip', () => {
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
    test('returns false for a non-ip address.', done => {
      assert.that(validator()(23)).is.false();
      done();
    });

    test('returns true for an ipv4 address.', done => {
      assert.that(validator()('192.168.0.1')).is.true();
      done();
    });

    test('returns true for an ipv6 address.', done => {
      assert.that(validator()('0:0:0:0:0:ffff:c0a8:1')).is.true();
      done();
    });

    suite('version', () => {
      test('returns false for an ipv4 when ipv6 is requested.', done => {
        assert.that(validator({ version: 6 })('192.168.0.1')).is.false();
        done();
      });

      test('returns true for an ipv4 when ipv4 is requested.', done => {
        assert.that(validator({ version: 4 })('192.168.0.1')).is.true();
        done();
      });

      test('returns false for an ipv6 when ipv4 is requested.', done => {
        assert.that(validator({ version: 4 })('0:0:0:0:0:ffff:c0a8:1')).is.false();
        done();
      });

      test('returns true for an ipv6 when ipv6 is requested.', done => {
        assert.that(validator({ version: 6 })('0:0:0:0:0:ffff:c0a8:1')).is.true();
        done();
      });
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      assert.that(validator({ default: '127.0.0.1' })('192.168.0.1')).is.equalTo('192.168.0.1');
      done();
    });

    test('returns the default value if not valid.', done => {
      assert.that(validator({ default: '127.0.0.1' })(23)).is.equalTo('127.0.0.1');
      done();
    });
  });
});
