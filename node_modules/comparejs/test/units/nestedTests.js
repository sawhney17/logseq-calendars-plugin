'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('cmp', () => {
  suite('eq', () => {
    test('both equal => true', done => {
      const first = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eq(first, second).should.equal(true);
      done();
    });

    test('not equal on first level => false', done => {
      const first = {
        name: 'foo',
        value: 23,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eq(first, second).should.equal(false);
      done();
    });

    test('missing property on first level => false', done => {
      const first = {
        name: 'foo',
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eq(first, second).should.equal(false);
      done();
    });

    test('not equal on second level => false', done => {
      const first = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: false,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eq(first, second).should.equal(false);
      done();
    });

    test('missing property on second level => false', done => {
      const first = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eq(first, second).should.equal(false);
      done();
    });

    test('empty object and empty array on second level => false', done => {
      const first = { foo: 'bar', baz: {}};
      const second = { foo: 'bar', baz: []};

      cmp.eq(first, second).should.equal(false);
      done();
    });
  });

  suite('eqs', () => {
    test('both equal => true', done => {
      const first = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eqs(first, second).should.equal(true);
      done();
    });

    test('not equal on first level => true', done => {
      const first = {
        name: 'foo',
        value: 23,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eqs(first, second).should.equal(true);
      done();
    });

    test('missing property on first level => false', done => {
      const first = {
        name: 'foo',
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eqs(first, second).should.equal(false);
      done();
    });

    test('not equal on second level => true', done => {
      const first = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: false,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eqs(first, second).should.equal(true);
      done();
    });

    test('missing property on second level => false', done => {
      const first = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          valid: true,
          items: [ 1, 2, 3 ]
        }
      };

      const second = {
        name: 'foo',
        value: 42,
        nested: {
          empty: null,
          items: [ 1, 2, 3 ]
        }
      };

      cmp.eqs(first, second).should.equal(false);
      done();
    });
  });
});
