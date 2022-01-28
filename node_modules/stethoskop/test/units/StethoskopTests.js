'use strict';

const assert = require('assertthat');

const Stethoskop = require('../../lib/Stethoskop.js');

suite('Stethoskop', () => {
  test('is a function.', done => {
    assert.that(Stethoskop).is.ofType('function');
    done();
  });
});
