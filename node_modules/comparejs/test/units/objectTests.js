'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('object x object', () => {
  /* eslint-disable no-new-object */
  const Empty = new Object(),
        O1 = new Object(),
        O2 = new Object(),
        P1 = new Object(),
        Q1 = new Object();
  /* eslint-enable no-new-object */

  const empty = {},
        o1 = { foo: 'bar' },
        o2 = { foo: 'bar' },
        p1 = { foo: 'baz' },
        q1 = { bar: 'foo' },
        r1 = { foo: '' },
        r2 = { foo: '' },
        s1 = { foo: null };

  O1.foo = 'bar';
  O2.foo = 'bar';
  P1.foo = 'baz';
  Q1.bar = 'foo';

  suite('eq', () => {
    suite('equal => true', () => {
      test('object x object', done => {
        cmp.eq(o1, o2).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.eq(o1, O1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.eq(O1, o1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.eq(O1, O2).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.eq(null, null).should.equal(true);
        done();
      });

      test('falsy x falsy', done => {
        cmp.eq(r1, r2).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.eq(o1, p1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.eq(o1, P1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.eq(O1, p1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.eq(O1, P1).should.equal(false);
        done();
      });

      test('object x null', done => {
        cmp.eq(o1, null).should.equal(false);
        done();
      });

      test('Object() x null', done => {
        cmp.eq(O1, null).should.equal(false);
        done();
      });

      test('null x object', done => {
        cmp.eq(null, o1).should.equal(false);
        done();
      });

      test('null x Object()', done => {
        cmp.eq(null, O1).should.equal(false);
        done();
      });

      test('object x falsy', done => {
        cmp.eq(o1, r1).should.equal(false);
        done();
      });

      test('falsy x object', done => {
        cmp.eq(r1, o1).should.equal(false);
        done();
      });

      test('falsy x falsy', done => {
        cmp.eq(r1, s1).should.equal(false);
        done();
      });

      test('object x empty array', done => {
        cmp.eq(empty, []).should.equal(false);
        done();
      });
    });
  });

  suite('eqs', () => {
    suite('equal => true', () => {
      test('object x object', done => {
        cmp.eqs(o1, p1).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.eqs(o1, P1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.eqs(O1, p1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.eqs(O1, P1).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.eqs(null, null).should.equal(true);
        done();
      });

      test('falsy x falsy', done => {
        cmp.eqs(r1, r2).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.eqs(o1, empty).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.eqs(o1, Empty).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.eqs(O1, empty).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.eqs(O1, Empty).should.equal(false);
        done();
      });

      test('object x null', done => {
        cmp.eqs(o1, null).should.equal(false);
        done();
      });

      test('Object() x null', done => {
        cmp.eqs(O1, null).should.equal(false);
        done();
      });

      test('null x object', done => {
        cmp.eqs(null, o1).should.equal(false);
        done();
      });

      test('null x Object()', done => {
        cmp.eqs(null, O1).should.equal(false);
        done();
      });

      test('object x falsy', done => {
        cmp.eqs(q1, r1).should.equal(false);
        done();
      });

      test('falsy x object', done => {
        cmp.eqs(r1, q1).should.equal(false);
        done();
      });

      test('falsy x falsy', done => {
        cmp.eqs(r1, s1).should.equal(false);
        done();
      });
    });
  });

  suite('ne', () => {
    suite('equal => false', () => {
      test('object x object', done => {
        cmp.ne(o1, o2).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.ne(o1, O1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.ne(O1, o1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ne(O1, O2).should.equal(false);
        done();
      });

      test('null x null', done => {
        cmp.ne(null, null).should.equal(false);
        done();
      });

      test('falsy x falsy', done => {
        cmp.ne(r1, r2).should.equal(false);
        done();
      });
    });

    suite('not equal => true', () => {
      test('object x object', done => {
        cmp.ne(o1, p1).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.ne(o1, P1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.ne(O1, p1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ne(O1, P1).should.equal(true);
        done();
      });

      test('object x null', done => {
        cmp.ne(o1, null).should.equal(true);
        done();
      });

      test('Object() x null', done => {
        cmp.ne(O1, null).should.equal(true);
        done();
      });

      test('null x object', done => {
        cmp.ne(null, o1).should.equal(true);
        done();
      });

      test('null x Object()', done => {
        cmp.ne(null, O1).should.equal(true);
        done();
      });

      test('falsy x falsy', done => {
        cmp.ne(r1, s1).should.equal(true);
        done();
      });

      test('object x false', done => {
        cmp.ne(o1, r1).should.equal(true);
        done();
      });

      test('falsy x object', done => {
        cmp.ne(r1, o1).should.equal(true);
        done();
      });
    });
  });

  suite('nes', () => {
    suite('equal => false', () => {
      test('object x object', done => {
        cmp.nes(o1, p1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.nes(o1, P1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.nes(O1, p1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.nes(O1, P1).should.equal(false);
        done();
      });

      test('null x null', done => {
        cmp.nes(null, null).should.equal(false);
        done();
      });

      test('falsy x falsy', done => {
        cmp.nes(r1, r2).should.equal(false);
        done();
      });

      test('object x false', done => {
        cmp.nes(o1, r1).should.equal(false);
        done();
      });

      test('falsy x object', done => {
        cmp.nes(r1, o1).should.equal(false);
        done();
      });
    });

    suite('not equal => true', () => {
      test('object x object', done => {
        cmp.nes(o1, empty).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.nes(o1, Empty).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.nes(O1, empty).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.nes(O1, Empty).should.equal(true);
        done();
      });

      test('object x null', done => {
        cmp.nes(o1, null).should.equal(true);
        done();
      });

      test('Object() x null', done => {
        cmp.nes(O1, null).should.equal(true);
        done();
      });

      test('null x object', done => {
        cmp.nes(null, o1).should.equal(true);
        done();
      });

      test('null x Object()', done => {
        cmp.nes(null, O1).should.equal(true);
        done();
      });

      test('falsy x falsy', done => {
        cmp.nes(r1, s1).should.equal(true);
        done();
      });
    });
  });

  suite('gt', () => {
    suite('greater than => true', () => {
      test('object x object', done => {
        cmp.gt(o1, empty).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.gt(o1, Empty).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.gt(O1, empty).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.gt(O1, Empty).should.equal(true);
        done();
      });

      test('falsy x object', done => {
        cmp.gt(r1, empty).should.equal(true);
        done();
      });
    });

    suite('equal => false', () => {
      test('object x object', done => {
        cmp.gt(o1, o2).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.gt(o1, O1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.gt(O1, o1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.gt(O1, O2).should.equal(false);
        done();
      });

      test('null x null', done => {
        cmp.gt(null, null).should.equal(false);
        done();
      });

      test('falsy x falsy', done => {
        cmp.gt(r1, r1).should.equal(false);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.gt(o1, p1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.gt(o1, P1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.gt(O1, p1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.gt(O1, P1).should.equal(false);
        done();
      });

      test('object x null', done => {
        cmp.gt(o1, null).should.equal(false);
        done();
      });

      test('Object() x null', done => {
        cmp.gt(O1, null).should.equal(false);
        done();
      });

      test('null x object', done => {
        cmp.gt(null, o1).should.equal(false);
        done();
      });

      test('null x Object()', done => {
        cmp.gt(null, O1).should.equal(false);
        done();
      });

      test('falsy x falsy', done => {
        cmp.gt(r1, r2).should.equal(false);
        done();
      });
    });

    suite('less than => false', () => {
      test('object x object', done => {
        cmp.gt(empty, o1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.gt(Empty, o1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.gt(empty, O1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.gt(Empty, O1).should.equal(false);
        done();
      });

      test('object x falsy', done => {
        cmp.gt(empty, r1).should.equal(false);
        done();
      });
    });
  });

  suite('gts', () => {
    suite('greater than => true', () => {
      test('object x object', done => {
        cmp.gts(o1, empty).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.gts(o1, Empty).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.gts(O1, empty).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.gts(O1, Empty).should.equal(true);
        done();
      });

      test('object x null', done => {
        cmp.gts(o1, null).should.equal(true);
        done();
      });

      test('Object() x null', done => {
        cmp.gts(O1, null).should.equal(true);
        done();
      });
    });

    suite('equal => false', () => {
      test('object x object', done => {
        cmp.gts(o1, o2).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.gts(o1, O1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.gts(O1, o1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.gts(O1, O2).should.equal(false);
        done();
      });

      test('null x null', done => {
        cmp.gts(null, null).should.equal(false);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.gts(o1, q1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.gts(o1, Q1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.gts(O1, q1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.gts(O1, Q1).should.equal(false);
        done();
      });
    });

    suite('less than => false', () => {
      test('object x object', done => {
        cmp.gts(empty, o1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.gts(Empty, o1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.gts(empty, O1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.gts(Empty, O1).should.equal(false);
        done();
      });

      test('null x object', done => {
        cmp.gts(null, o1).should.equal(false);
        done();
      });

      test('null x Object()', done => {
        cmp.gts(null, O1).should.equal(false);
        done();
      });
    });
  });

  suite('ge', () => {
    suite('greater than => true', () => {
      test('object x object', done => {
        cmp.ge(o1, empty).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.ge(o1, Empty).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.ge(O1, empty).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ge(O1, Empty).should.equal(true);
        done();
      });

      test('falsy x object', done => {
        cmp.ge(r1, empty).should.equal(true);
        done();
      });
    });

    suite('equal => true', () => {
      test('object x object', done => {
        cmp.ge(o1, o2).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.ge(o1, O1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.ge(O1, o1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ge(O1, O2).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.ge(null, null).should.equal(true);
        done();
      });

      test('falsy x falsy', done => {
        cmp.ge(r1, r1).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.ge(o1, p1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.ge(o1, P1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.ge(O1, p1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ge(O1, P1).should.equal(false);
        done();
      });

      test('object x null', done => {
        cmp.ge(o1, null).should.equal(false);
        done();
      });

      test('Object() x null', done => {
        cmp.ge(O1, null).should.equal(false);
        done();
      });

      test('null x object', done => {
        cmp.ge(null, o1).should.equal(false);
        done();
      });

      test('null x Object()', done => {
        cmp.ge(null, O1).should.equal(false);
        done();
      });

      test('null x falsy', done => {
        cmp.ge(null, r1).should.equal(false);
        done();
      });

      test('falsy x null', done => {
        cmp.ge(r1, null).should.equal(false);
        done();
      });

      test('object x falsy', done => {
        cmp.ge(o1, r1).should.equal(false);
        done();
      });

      test('falsy x object', done => {
        cmp.ge(r1, o1).should.equal(false);
        done();
      });
    });

    suite('less than => false', () => {
      test('object x object', done => {
        cmp.ge(empty, o1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.ge(Empty, o1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.ge(empty, O1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ge(Empty, O1).should.equal(false);
        done();
      });

      test('object x falsy', done => {
        cmp.ge(empty, r1).should.equal(false);
        done();
      });
    });
  });

  suite('ges', () => {
    suite('greater than => true', () => {
      test('object x object', done => {
        cmp.ges(o1, empty).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.ges(o1, Empty).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.ges(O1, empty).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ges(O1, Empty).should.equal(true);
        done();
      });

      test('object x null', done => {
        cmp.ges(o1, null).should.equal(true);
        done();
      });

      test('Object() x null', done => {
        cmp.ges(O1, null).should.equal(true);
        done();
      });
    });

    suite('equal => true', () => {
      test('object x object', done => {
        cmp.ges(o1, o2).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.ges(o1, O1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.ges(O1, o1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ges(O1, O2).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.ges(null, null).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.ges(o1, q1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.ges(o1, Q1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.ges(O1, q1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ges(O1, Q1).should.equal(false);
        done();
      });
    });

    suite('less than => false', () => {
      test('object x object', done => {
        cmp.ges(empty, o1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.ges(Empty, o1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.ges(empty, O1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.ges(Empty, O1).should.equal(false);
        done();
      });

      test('null x object', done => {
        cmp.ges(null, o1).should.equal(false);
        done();
      });

      test('null x Object()', done => {
        cmp.ges(null, O1).should.equal(false);
        done();
      });
    });
  });

  suite('lt', () => {
    suite('greater than => false', () => {
      test('object x object', done => {
        cmp.lt(o1, empty).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.lt(o1, Empty).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.lt(O1, empty).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.lt(O1, Empty).should.equal(false);
        done();
      });

      test('falsy x object', done => {
        cmp.lt(r1, empty).should.equal(false);
        done();
      });
    });

    suite('equal => false', () => {
      test('object x object', done => {
        cmp.lt(o1, o2).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.lt(o1, O1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.lt(O1, o1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.lt(O1, O2).should.equal(false);
        done();
      });

      test('null x null', done => {
        cmp.lt(null, null).should.equal(false);
        done();
      });

      test('falsy x falsy', done => {
        cmp.lt(r1, r1).should.equal(false);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.lt(o1, p1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.lt(o1, P1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.lt(O1, p1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.lt(O1, P1).should.equal(false);
        done();
      });

      test('object x null', done => {
        cmp.lt(o1, null).should.equal(false);
        done();
      });

      test('Object() x null', done => {
        cmp.lt(O1, null).should.equal(false);
        done();
      });

      test('null x object', done => {
        cmp.lt(null, o1).should.equal(false);
        done();
      });

      test('null x Object()', done => {
        cmp.lt(null, O1).should.equal(false);
        done();
      });

      test('falsy x falsy', done => {
        cmp.lt(r1, r2).should.equal(false);
        done();
      });
    });

    suite('less than => true', () => {
      test('object x object', done => {
        cmp.lt(empty, o1).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.lt(Empty, o1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.lt(empty, O1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.lt(Empty, O1).should.equal(true);
        done();
      });

      test('object x falsy', done => {
        cmp.lt(empty, r1).should.equal(true);
        done();
      });
    });
  });

  suite('lts', () => {
    suite('greater than => false', () => {
      test('object x object', done => {
        cmp.lts(o1, empty).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.lts(o1, Empty).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.lts(O1, empty).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.lts(O1, Empty).should.equal(false);
        done();
      });

      test('object x null', done => {
        cmp.lts(o1, null).should.equal(false);
        done();
      });

      test('Object() x null', done => {
        cmp.lts(O1, null).should.equal(false);
        done();
      });
    });

    suite('equal => false', () => {
      test('object x object', done => {
        cmp.lts(o1, o2).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.lts(o1, O1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.lts(O1, o1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.lts(O1, O2).should.equal(false);
        done();
      });

      test('null x null', done => {
        cmp.lts(null, null).should.equal(false);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.lts(o1, q1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.lts(o1, Q1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.lts(O1, q1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.lts(O1, Q1).should.equal(false);
        done();
      });
    });

    suite('less than => true', () => {
      test('object x object', done => {
        cmp.lts(empty, o1).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.lts(Empty, o1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.lts(empty, O1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.lts(Empty, O1).should.equal(true);
        done();
      });

      test('null x object', done => {
        cmp.lts(null, o1).should.equal(true);
        done();
      });

      test('null x Object()', done => {
        cmp.lts(null, O1).should.equal(true);
        done();
      });
    });
  });

  suite('le', () => {
    suite('greater than => false', () => {
      test('object x object', done => {
        cmp.le(o1, empty).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.le(o1, Empty).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.le(O1, empty).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.le(O1, Empty).should.equal(false);
        done();
      });

      test('falsy x object', done => {
        cmp.le(r1, empty).should.equal(false);
        done();
      });
    });

    suite('equal => true', () => {
      test('object x object', done => {
        cmp.le(o1, o2).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.le(o1, O1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.le(O1, o1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.le(O1, O2).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.le(null, null).should.equal(true);
        done();
      });

      test('falsy x falsy', done => {
        cmp.le(r1, r1).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.le(o1, p1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.le(o1, P1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.le(O1, p1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.le(O1, P1).should.equal(false);
        done();
      });

      test('object x null', done => {
        cmp.le(o1, null).should.equal(false);
        done();
      });

      test('Object() x null', done => {
        cmp.le(O1, null).should.equal(false);
        done();
      });

      test('null x object', done => {
        cmp.le(null, o1).should.equal(false);
        done();
      });

      test('null x Object()', done => {
        cmp.le(null, O1).should.equal(false);
        done();
      });

      test('null x falsy', done => {
        cmp.le(null, r1).should.equal(false);
        done();
      });

      test('falsy x null', done => {
        cmp.le(r1, null).should.equal(false);
        done();
      });

      test('object x falsy', done => {
        cmp.le(o1, r1).should.equal(false);
        done();
      });

      test('falsy x object', done => {
        cmp.le(r1, o1).should.equal(false);
        done();
      });
    });

    suite('less than => true', () => {
      test('object x object', done => {
        cmp.le(empty, o1).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.le(Empty, o1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.le(empty, O1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.le(Empty, O1).should.equal(true);
        done();
      });

      test('object x falsy', done => {
        cmp.le(empty, r1).should.equal(true);
        done();
      });
    });
  });

  suite('les', () => {
    suite('greater than => false', () => {
      test('object x object', done => {
        cmp.les(o1, empty).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.les(o1, Empty).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.les(O1, empty).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.les(O1, Empty).should.equal(false);
        done();
      });

      test('object x null', done => {
        cmp.les(o1, null).should.equal(false);
        done();
      });

      test('Object() x null', done => {
        cmp.les(O1, null).should.equal(false);
        done();
      });
    });

    suite('equal => true', () => {
      test('object x object', done => {
        cmp.les(o1, o2).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.les(o1, O1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.les(O1, o1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.les(O1, O2).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.les(null, null).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('object x object', done => {
        cmp.les(o1, q1).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.les(o1, Q1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.les(O1, q1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.les(O1, Q1).should.equal(false);
        done();
      });
    });

    suite('less than => true', () => {
      test('object x object', done => {
        cmp.les(empty, o1).should.equal(true);
        done();
      });

      test('object x Object()', done => {
        cmp.les(Empty, o1).should.equal(true);
        done();
      });

      test('Object() x object', done => {
        cmp.les(empty, O1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.les(Empty, O1).should.equal(true);
        done();
      });

      test('null x object', done => {
        cmp.les(null, o1).should.equal(true);
        done();
      });

      test('null x Object()', done => {
        cmp.les(null, O1).should.equal(true);
        done();
      });
    });
  });

  suite('id', () => {
    suite('identical => true', () => {
      test('object x object', done => {
        cmp.id(o1, o1).should.equal(true);
        done();
      });

      test('Object() x Object()', done => {
        cmp.id(O1, O1).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.id(null, null).should.equal(true);
        done();
      });

      test('falsy x falsy', done => {
        cmp.id(r1, r1).should.equal(true);
        done();
      });
    });

    suite('not identical => false', () => {
      test('object x object', done => {
        cmp.id(o1, o2).should.equal(false);
        done();
      });

      test('object x Object()', done => {
        cmp.id(o1, O1).should.equal(false);
        done();
      });

      test('Object() x object', done => {
        cmp.id(O1, o1).should.equal(false);
        done();
      });

      test('Object() x Object()', done => {
        cmp.id(O1, O2).should.equal(false);
        done();
      });

      test('falsy x falsy', done => {
        cmp.id(r1, r2).should.equal(false);
        done();
      });
    });
  });
});
