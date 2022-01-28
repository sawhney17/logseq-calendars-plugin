'use strict';

const assert = require('assertthat');

const partOf = require('../../lib/partOf');

suite('partOf', () => {
  test('is a function.', done => {
    assert.that(partOf).is.ofType('function');
    done();
  });

  suite('returns true', () => {
    test('if subset is part of superset.', done => {
      const subset = { foo: 'a' },
            superset = { foo: 'a', bar: 'b' };

      assert.that(partOf(subset, superset)).is.true();
      done();
    });

    test('if subset is part of superset, even for nested objects.', done => {
      const subset = { bas: { baz: 'c' }},
            superset = { foo: 'a', bar: 'b', bas: { baz: 'c' }};

      assert.that(partOf(subset, superset)).is.true();
      done();
    });

    test('if subset is part of superset, even for partially nested objects', done => {
      const subset = { bas: { baz: 'c' }},
            superset = { foo: 'a', bar: 'b', bas: { baz: 'c', bax: 'd' }};

      assert.that(partOf(subset, superset)).is.true();
      done();
    });
  });

  suite('returns false', () => {
    test('if subset is not part of superset.', done => {
      const subset = { foo: 'b' },
            superset = { foo: 'a', bar: 'b' };

      assert.that(partOf(subset, superset)).is.false();
      done();
    });

    test('if subset is not part of superset, even for nested objects.', done => {
      const subset = { bax: { baz: 'c' }},
            superset = { foo: 'a', bar: 'b', bas: { baz: 'c' }};

      assert.that(partOf(subset, superset)).is.false();
      done();
    });

    test('if subset is not part of superset, even for partially nested objects', done => {
      const subset = { bax: { baz: 'c' }},
            superset = { foo: 'a', bar: 'b', bas: { baz: 'c', bax: 'd' }};

      assert.that(partOf(subset, superset)).is.false();
      done();
    });
  });
});
