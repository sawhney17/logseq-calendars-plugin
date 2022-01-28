'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('alias', () => {
  test('eq x equal', done => {
    cmp.eq(cmp.eq(23, 23), cmp.equal(23, 23)).should.equal(true);
    done();
  });

  test('ne x notEqual', done => {
    cmp.eq(cmp.ne(23, 23), cmp.notEqual(23, 23)).should.equal(true);
    done();
  });

  test('gt x greaterThan', done => {
    cmp.eq(cmp.gt(23, 23), cmp.greaterThan(23, 23)).should.equal(true);
    done();
  });

  test('ge x greaterThanOrEqual', done => {
    cmp.eq(cmp.ge(23, 23), cmp.greaterThanOrEqual(23, 23)).should.equal(true);
    done();
  });

  test('lt x lessThan', done => {
    cmp.eq(cmp.lt(23, 23), cmp.lessThan(23, 23)).should.equal(true);
    done();
  });

  test('le x lessThanOrEqual', done => {
    cmp.eq(cmp.le(23, 23), cmp.lessThanOrEqual(23, 23)).should.equal(true);
    done();
  });

  test('id x identical', done => {
    cmp.eq(cmp.id(23, 23), cmp.identical(23, 23)).should.equal(true);
    done();
  });

  test('eqs x equalByStructure', done => {
    cmp.eq(cmp.eqs({ }, { }), cmp.equalByStructure({ }, { })).should.equal(true);
    done();
  });

  test('nes x notEqualByStructure', done => {
    cmp.eq(cmp.nes({ }, { }), cmp.notEqualByStructure({ }, { })).should.equal(true);
    done();
  });

  test('gts x greaterThanByStructure', done => {
    cmp.eq(cmp.gts({ }, { }), cmp.greaterThanByStructure({ }, { })).should.equal(true);
    done();
  });

  test('ges x greaterThanOrEqualByStructure', done => {
    cmp.eq(cmp.ges({ }, { }), cmp.greaterThanOrEqualByStructure({ }, { })).should.equal(true);
    done();
  });

  test('lts x lessThanByStructure', done => {
    cmp.eq(cmp.lts({ }, { }), cmp.lessThanByStructure({ }, { })).should.equal(true);
    done();
  });

  test('les x lessThanOrEqualByStructure', done => {
    cmp.eq(cmp.les({ }, { }), cmp.lessThanOrEqualByStructure({ }, { })).should.equal(true);
    done();
  });
});
