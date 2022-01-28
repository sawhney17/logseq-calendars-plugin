'use strict';

const assert = require('assertthat');

const getRandom = require('../../lib/getRandom');

suite('getRandom', () => {
  test('is a function.', done => {
    assert.that(getRandom).is.ofType('function');
    done();
  });

  test('throws an error if min is missing.', done => {
    assert.that(() => {
      getRandom();
    }).is.throwing('Min is missing.');
    done();
  });

  test('throws an error if max is missing.', done => {
    assert.that(() => {
      getRandom(1);
    }).is.throwing('Max is missing.');
    done();
  });

  test('returns a random number between min and max.', done => {
    const number = getRandom(1, 10);

    assert.that(number).is.between(1, 10);
    done();
  });
});
