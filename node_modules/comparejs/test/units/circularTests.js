'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('cmp', () => {
  suite('eq', () => {
    test('first with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.eq(first, second).should.equal(false);
      done();
    });

    test('second with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.eq(first, second).should.equal(false);
      done();
    });

    test('both with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.eq(first, second).should.equal(true);
      done();
    });
  });

  suite('eqs', () => {
    test('first with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.eqs(first, second).should.equal(false);
      done();
    });

    test('second with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.eqs(first, second).should.equal(false);
      done();
    });

    test('both with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.eqs(first, second).should.equal(true);
      done();
    });
  });

  suite('ne', () => {
    test('first with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.ne(first, second).should.equal(true);
      done();
    });

    test('second with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.ne(first, second).should.equal(true);
      done();
    });

    test('both with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.ne(first, second).should.equal(false);
      done();
    });
  });

  suite('nes', () => {
    test('first with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.nes(first, second).should.equal(true);
      done();
    });

    test('second with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.nes(first, second).should.equal(true);
      done();
    });

    test('both with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.nes(first, second).should.equal(false);
      done();
    });
  });

  suite('gt', () => {
    test('first with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.gt(first, second).should.equal(true);
      done();
    });

    test('second with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.gt(first, second).should.equal(false);
      done();
    });

    test('both with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.gt(first, second).should.equal(false);
      done();
    });
  });

  suite('gts', () => {
    test('first with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.gts(first, second).should.equal(true);
      done();
    });

    test('second with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.gts(first, second).should.equal(false);
      done();
    });

    test('both with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.gts(first, second).should.equal(false);
      done();
    });
  });

  suite('ge', () => {
    test('first with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.ge(first, second).should.equal(true);
      done();
    });

    test('second with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.ge(first, second).should.equal(false);
      done();
    });

    test('both with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.ge(first, second).should.equal(true);
      done();
    });
  });

  suite('ges', () => {
    test('first with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.ges(first, second).should.equal(true);
      done();
    });

    test('second with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.ges(first, second).should.equal(false);
      done();
    });

    test('both with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.ges(first, second).should.equal(true);
      done();
    });
  });

  suite('lt', () => {
    test('first with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.lt(first, second).should.equal(false);
      done();
    });

    test('second with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.lt(first, second).should.equal(true);
      done();
    });

    test('both with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.lt(first, second).should.equal(false);
      done();
    });
  });

  suite('lts', () => {
    test('first with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.lts(first, second).should.equal(false);
      done();
    });

    test('second with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.lts(first, second).should.equal(true);
      done();
    });

    test('both with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.lts(first, second).should.equal(false);
      done();
    });
  });

  suite('le', () => {
    test('first with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.le(first, second).should.equal(false);
      done();
    });

    test('second with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.le(first, second).should.equal(true);
      done();
    });

    test('both with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.le(first, second).should.equal(true);
      done();
    });
  });

  suite('les', () => {
    test('first with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.les(first, second).should.equal(false);
      done();
    });

    test('second with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.les(first, second).should.equal(true);
      done();
    });

    test('both with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.les(first, second).should.equal(true);
      done();
    });
  });

  suite('id', () => {
    test('first with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.id(first, second).should.equal(false);
      done();
    });

    test('second with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      second.mySelf = second;
      cmp.id(first, second).should.equal(false);
      done();
    });

    test('both with self reference => false', done => {
      const first = {
        name: 'foo'
      };

      const second = {
        name: 'foo'
      };

      first.mySelf = first;
      second.mySelf = second;
      cmp.id(first, second).should.equal(false);
      done();
    });

    test('identical with self reference => true', done => {
      const first = {
        name: 'foo'
      };

      first.mySelf = first;
      cmp.id(first, first).should.equal(true);
      done();
    });
  });
});
