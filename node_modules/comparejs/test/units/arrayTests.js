'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('array x array', () => {
  /* eslint-disable no-array-constructor */
  const A1 = new Array(),
        A2 = new Array(),
        B1 = new Array(),
        Empty = new Array();
  /* eslint-enable no-array-constructor */

  const a1 = [ 2 ],
        a2 = [ 2 ],
        b1 = [ 3 ],
        empty = [];

  A1.push(2);
  A2.push(2);
  B1.push(3);

  suite('eq', () => {
    suite('equal => true', () => {
      test('array x array', done => {
        cmp.eq(a1, a2).should.equal(true);
        done();
      });

      test('array x Array()', done => {
        cmp.eq(a1, A1).should.equal(true);
        done();
      });

      test('Array() x array', done => {
        cmp.eq(A1, a1).should.equal(true);
        done();
      });

      test('Array() x Array()', done => {
        cmp.eq(A1, A2).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.eq(null, null).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('array x array', done => {
        cmp.eq(a1, b1).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.eq(a1, B1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.eq(A1, b1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.eq(A1, B1).should.equal(false);
        done();
      });

      test('array x null', done => {
        cmp.eq(a1, null).should.equal(false);
        done();
      });

      test('Array() x null', done => {
        cmp.eq(A1, null).should.equal(false);
        done();
      });

      test('null x array', done => {
        cmp.eq(null, a1).should.equal(false);
        done();
      });

      test('null x Array()', done => {
        cmp.eq(null, A1).should.equal(false);
        done();
      });
    });
  });

  suite('eqs', () => {
    suite('any => false', () => {
      test('array x array', done => {
        cmp.eqs(a1, a1).should.equal(false);
        done();
      });
    });
  });

  suite('ne', () => {
    suite('equal => false', () => {
      test('array x array', done => {
        cmp.ne(a1, a2).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.ne(a1, A1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.ne(A1, a1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.ne(A1, A2).should.equal(false);
        done();
      });

      test('null x null', done => {
        cmp.ne(null, null).should.equal(false);
        done();
      });
    });

    suite('not equal => true', () => {
      test('array x array', done => {
        cmp.ne(a1, b1).should.equal(true);
        done();
      });

      test('array x Array()', done => {
        cmp.ne(a1, B1).should.equal(true);
        done();
      });

      test('Array() x array', done => {
        cmp.ne(A1, b1).should.equal(true);
        done();
      });

      test('Array() x Array()', done => {
        cmp.ne(A1, B1).should.equal(true);
        done();
      });

      test('array x null', done => {
        cmp.ne(a1, null).should.equal(true);
        done();
      });

      test('Array() x null', done => {
        cmp.ne(A1, null).should.equal(true);
        done();
      });

      test('null x array', done => {
        cmp.ne(null, a1).should.equal(true);
        done();
      });

      test('null x Array()', done => {
        cmp.ne(null, A1).should.equal(true);
        done();
      });
    });
  });

  suite('nes', () => {
    suite('any => false', () => {
      test('array x array', done => {
        cmp.nes(a1, a1).should.equal(false);
        done();
      });
    });
  });

  suite('gt', () => {
    suite('greater than => true', () => {
      test('array x array', done => {
        cmp.gt(a1, empty).should.equal(true);
        done();
      });

      test('array x Array()', done => {
        cmp.gt(a1, Empty).should.equal(true);
        done();
      });

      test('Array() x array', done => {
        cmp.gt(A1, empty).should.equal(true);
        done();
      });

      test('Array() x Array()', done => {
        cmp.gt(A1, Empty).should.equal(true);
        done();
      });
    });

    suite('equal => false', () => {
      test('array x array', done => {
        cmp.gt(a1, a2).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.gt(a1, A1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.gt(A1, a1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.gt(A1, A2).should.equal(false);
        done();
      });

      test('null x null', done => {
        cmp.gt(null, null).should.equal(false);
        done();
      });
    });

    suite('not equal => false', () => {
      test('array x array', done => {
        cmp.gt(a1, b1).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.gt(a1, B1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.gt(A1, b1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.gt(A1, B1).should.equal(false);
        done();
      });

      test('array x null', done => {
        cmp.gt(a1, null).should.equal(false);
        done();
      });

      test('Array() x null', done => {
        cmp.gt(A1, null).should.equal(false);
        done();
      });

      test('null x array', done => {
        cmp.gt(null, a1).should.equal(false);
        done();
      });

      test('null x Array()', done => {
        cmp.gt(null, A1).should.equal(false);
        done();
      });
    });

    suite('less than => false', () => {
      test('array x array', done => {
        cmp.gt(empty, a1).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.gt(Empty, a1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.gt(empty, A1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.gt(Empty, A1).should.equal(false);
        done();
      });
    });
  });

  suite('gts', () => {
    suite('any => false', () => {
      test('array x array', done => {
        cmp.gts(a1, a1).should.equal(false);
        done();
      });
    });
  });

  suite('ge', () => {
    suite('greater than => true', () => {
      test('array x array', done => {
        cmp.ge(a1, empty).should.equal(true);
        done();
      });

      test('array x Array()', done => {
        cmp.ge(a1, Empty).should.equal(true);
        done();
      });

      test('Array() x array', done => {
        cmp.ge(A1, empty).should.equal(true);
        done();
      });

      test('Array() x Array()', done => {
        cmp.ge(A1, Empty).should.equal(true);
        done();
      });
    });

    suite('equal => true', () => {
      test('array x array', done => {
        cmp.ge(a1, a2).should.equal(true);
        done();
      });

      test('array x Array()', done => {
        cmp.ge(a1, A1).should.equal(true);
        done();
      });

      test('Array() x array', done => {
        cmp.ge(A1, a1).should.equal(true);
        done();
      });

      test('Array() x Array()', done => {
        cmp.ge(A1, A2).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.ge(null, null).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('array x array', done => {
        cmp.ge(a1, b1).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.ge(a1, B1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.ge(A1, b1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.ge(A1, B1).should.equal(false);
        done();
      });

      test('array x null', done => {
        cmp.ge(a1, null).should.equal(false);
        done();
      });

      test('Array() x null', done => {
        cmp.ge(A1, null).should.equal(false);
        done();
      });

      test('null x array', done => {
        cmp.ge(null, a1).should.equal(false);
        done();
      });

      test('null x Array()', done => {
        cmp.ge(null, A1).should.equal(false);
        done();
      });
    });

    suite('less than => false', () => {
      test('array x array', done => {
        cmp.ge(empty, a1).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.ge(Empty, a1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.ge(empty, A1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.ge(Empty, A1).should.equal(false);
        done();
      });
    });
  });

  suite('ges', () => {
    suite('any => false', () => {
      test('array x array', done => {
        cmp.ges(a1, a1).should.equal(false);
        done();
      });
    });
  });

  suite('lt', () => {
    suite('greater than => false', () => {
      test('array x array', done => {
        cmp.lt(a1, empty).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.lt(a1, Empty).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.lt(A1, empty).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.lt(A1, Empty).should.equal(false);
        done();
      });
    });

    suite('equal => false', () => {
      test('array x array', done => {
        cmp.lt(a1, a2).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.lt(a1, A1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.lt(A1, a1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.lt(A1, A2).should.equal(false);
        done();
      });

      test('null x null', done => {
        cmp.lt(null, null).should.equal(false);
        done();
      });
    });

    suite('not equal => false', () => {
      test('array x array', done => {
        cmp.lt(a1, b1).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.lt(a1, B1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.lt(A1, b1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.lt(A1, B1).should.equal(false);
        done();
      });

      test('array x null', done => {
        cmp.lt(a1, null).should.equal(false);
        done();
      });

      test('Array() x null', done => {
        cmp.lt(A1, null).should.equal(false);
        done();
      });

      test('null x array', done => {
        cmp.lt(null, a1).should.equal(false);
        done();
      });

      test('null x Array()', done => {
        cmp.lt(null, A1).should.equal(false);
        done();
      });
    });

    suite('less than => true', () => {
      test('array x array', done => {
        cmp.lt(empty, a1).should.equal(true);
        done();
      });

      test('array x Array()', done => {
        cmp.lt(Empty, a1).should.equal(true);
        done();
      });

      test('Array() x array', done => {
        cmp.lt(empty, A1).should.equal(true);
        done();
      });

      test('Array() x Array()', done => {
        cmp.lt(Empty, A1).should.equal(true);
        done();
      });
    });
  });

  suite('lts', () => {
    suite('any => false', () => {
      test('array x array', done => {
        cmp.lts(a1, a1).should.equal(false);
        done();
      });
    });
  });

  suite('le', () => {
    suite('greater than => false', () => {
      test('array x array', done => {
        cmp.le(a1, empty).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.le(a1, Empty).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.le(A1, empty).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.le(A1, Empty).should.equal(false);
        done();
      });
    });

    suite('equal => true', () => {
      test('array x array', done => {
        cmp.le(a1, a2).should.equal(true);
        done();
      });

      test('array x Array()', done => {
        cmp.le(a1, A1).should.equal(true);
        done();
      });

      test('Array() x array', done => {
        cmp.le(A1, a1).should.equal(true);
        done();
      });

      test('Array() x Array()', done => {
        cmp.le(A1, A2).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.le(null, null).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('array x array', done => {
        cmp.le(a1, b1).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.le(a1, B1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.le(A1, b1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.le(A1, B1).should.equal(false);
        done();
      });

      test('array x null', done => {
        cmp.le(a1, null).should.equal(false);
        done();
      });

      test('Array() x null', done => {
        cmp.le(A1, null).should.equal(false);
        done();
      });

      test('null x array', done => {
        cmp.le(null, a1).should.equal(false);
        done();
      });

      test('null x Array()', done => {
        cmp.le(null, A1).should.equal(false);
        done();
      });
    });

    suite('less than => true', () => {
      test('array x array', done => {
        cmp.le(empty, a1).should.equal(true);
        done();
      });

      test('array x Array()', done => {
        cmp.le(Empty, a1).should.equal(true);
        done();
      });

      test('Array() x array', done => {
        cmp.le(empty, A1).should.equal(true);
        done();
      });

      test('Array() x Array()', done => {
        cmp.le(Empty, A1).should.equal(true);
        done();
      });
    });
  });

  suite('les', () => {
    suite('any => false', () => {
      test('array x array', done => {
        cmp.les(a1, a1).should.equal(false);
        done();
      });
    });
  });

  suite('id', () => {
    suite('identical => true', () => {
      test('array x array', done => {
        cmp.id(a1, a1).should.equal(true);
        done();
      });

      test('Array() x Array()', done => {
        cmp.id(A1, A1).should.equal(true);
        done();
      });

      test('null x null', done => {
        cmp.id(null, null).should.equal(true);
        done();
      });
    });

    suite('not identical => false', () => {
      test('array x array', done => {
        cmp.id(a1, a2).should.equal(false);
        done();
      });

      test('array x Array()', done => {
        cmp.id(a1, A1).should.equal(false);
        done();
      });

      test('Array() x array', done => {
        cmp.id(A1, a1).should.equal(false);
        done();
      });

      test('Array() x Array()', done => {
        cmp.id(A1, A2).should.equal(false);
        done();
      });
    });
  });
});
