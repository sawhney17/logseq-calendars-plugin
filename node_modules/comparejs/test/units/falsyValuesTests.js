'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('falsy values', () => {
  suite('eq', () => {
    test(' 0 x 0', done => {
      cmp.eq(0, 0).should.equal(true);
      done();
    });

    test(' 0 x ""', done => {
      cmp.eq(0, '').should.equal(false);
      done();
    });

    test(' 0 x false', done => {
      cmp.eq(0, false).should.equal(false);
      done();
    });

    test(' 0 x null', done => {
      cmp.eq(0, null).should.equal(false);
      done();
    });

    test(' 0 x undefined', done => {
      cmp.eq(0, undefined).should.equal(false);
      done();
    });

    test('"" x 0', done => {
      cmp.eq('', 0).should.equal(false);
      done();
    });

    test('"" x ""', done => {
      cmp.eq('', '').should.equal(true);
      done();
    });

    test('"" x false', done => {
      cmp.eq('', false).should.equal(false);
      done();
    });

    test('"" x null', done => {
      cmp.eq('', null).should.equal(false);
      done();
    });

    test('"" x undefined', done => {
      cmp.eq('', undefined).should.equal(false);
      done();
    });

    test('false x 0', done => {
      cmp.eq(false, 0).should.equal(false);
      done();
    });

    test('false x ""', done => {
      cmp.eq(false, '').should.equal(false);
      done();
    });

    test('false x false', done => {
      cmp.eq(false, false).should.equal(true);
      done();
    });

    test('false x null', done => {
      cmp.eq(false, null).should.equal(false);
      done();
    });

    test('false x undefined', done => {
      cmp.eq(false, undefined).should.equal(false);
      done();
    });

    test('null x 0', done => {
      cmp.eq(null, 0).should.equal(false);
      done();
    });

    test('null x ""', done => {
      cmp.eq(null, '').should.equal(false);
      done();
    });

    test('null x false', done => {
      cmp.eq(null, false).should.equal(false);
      done();
    });

    test('null x null', done => {
      cmp.eq(null, null).should.equal(true);
      done();
    });

    test('null x undefined', done => {
      cmp.eq(null, undefined).should.equal(false);
      done();
    });

    test('undefined x 0', done => {
      cmp.eq(undefined, 0).should.equal(false);
      done();
    });

    test('undefined x ""', done => {
      cmp.eq(undefined, '').should.equal(false);
      done();
    });

    test('undefined x false', done => {
      cmp.eq(undefined, false).should.equal(false);
      done();
    });

    test('undefined x null', done => {
      cmp.eq(undefined, null).should.equal(false);
      done();
    });

    test('undefined x undefined', done => {
      cmp.eq(undefined, undefined).should.equal(true);
      done();
    });
  });
});
