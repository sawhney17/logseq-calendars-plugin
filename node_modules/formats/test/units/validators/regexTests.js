'use strict';

const assert = require('assertthat');

const validator = require('../../../lib/validators/regex');

suite('regex', () => {
  test('is a function.', done => {
    assert.that(validator).is.ofType('function');
    done();
  });

  test('throws an error if options are missing.', done => {
    assert.that(() => {
      validator();
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if regex is missing.', done => {
    assert.that(() => {
      validator({});
    }).is.throwing('Regular expression is missing.');
    done();
  });

  test('returns a function.', done => {
    assert.that(validator({ expression: /foo/ })).is.ofType('function');
    done();
  });

  test('throws on unknown properties.', done => {
    assert.that(() => {
      validator({ expression: /^foo$/, nonExistent: 'foobar' });
    }).is.throwing('Unknown property nonExistent.');
    done();
  });

  suite('basics', () => {
    suite('expression', () => {
      test('returns false if the regex does not match.', done => {
        assert.that(validator({ expression: /^foo$/ })('foobar')).is.false();
        done();
      });

      test('returns true if the regex matches.', done => {
        assert.that(validator({ expression: /^foo/ })('foobar')).is.true();
        done();
      });
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      assert.that(validator({ expression: /^foo/, default: 'bas' })('foobar')).is.equalTo('foobar');
      done();
    });

    test('returns the default value if not valid.', done => {
      assert.that(validator({ expression: /^foo$/, default: 'bas' })('foobar')).is.equalTo('bas');
      done();
    });
  });
});
