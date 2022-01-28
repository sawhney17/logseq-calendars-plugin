'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('function x function', () => {
  /* eslint-disable no-new-func */
  const F1 = new Function('return 23;'),
        F2 = new Function('return 23;'),
        G1 = new Function('return 42;');
  /* eslint-enable no-new-func */

  const f1 = function () {
          return 23;
        },
        f2 = function () {
          return 23;
        },
        g1 = function () {
          return 42;
        };

  suite('eq', () => {
    suite('equal => true', () => {
      test('function x function', done => {
        cmp.eq(f1, f2).should.equal(true);
        done();
      });

      test('Function() x Function()', done => {
        cmp.eq(F1, F2).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('function x function', done => {
        cmp.eq(f1, g1).should.equal(false);
        done();
      });

      test('function x Function()', done => {
        cmp.eq(f1, F1).should.equal(false);
        done();
      });

      test('Function() x function', done => {
        cmp.eq(F1, f1).should.equal(false);
        done();
      });

      test('Function() x Function()', done => {
        cmp.eq(F1, G1).should.equal(false);
        done();
      });
    });
  });

  suite('eqs', () => {
    suite('any => false', () => {
      test('function x function', done => {
        cmp.eqs(f1, f1).should.equal(false);
        done();
      });
    });
  });

  suite('ne', () => {
    suite('equal => false', () => {
      test('function x function', done => {
        cmp.ne(f1, f2).should.equal(false);
        done();
      });

      test('Function() x Function()', done => {
        cmp.ne(F1, F2).should.equal(false);
        done();
      });
    });

    suite('not equal => true', () => {
      test('function x function', done => {
        cmp.ne(f1, g1).should.equal(true);
        done();
      });

      test('function x Function()', done => {
        cmp.ne(f1, F1).should.equal(true);
        done();
      });

      test('Function() x function', done => {
        cmp.ne(F1, f1).should.equal(true);
        done();
      });

      test('Function() x Function()', done => {
        cmp.ne(F1, G1).should.equal(true);
        done();
      });
    });
  });

  suite('nes', () => {
    suite('any => false', () => {
      test('function x function', done => {
        cmp.nes(f1, f1).should.equal(false);
        done();
      });
    });
  });

  suite('gt', () => {
    suite('any => false', () => {
      test('function x function (same body)', done => {
        cmp.gt(f1, f2).should.equal(false);
        done();
      });

      test('function x function (different body)', done => {
        cmp.gt(f1, g1).should.equal(false);
        done();
      });

      test('function x Function()', done => {
        cmp.gt(f1, F1).should.equal(false);
        done();
      });

      test('Function() x function', done => {
        cmp.gt(F1, f1).should.equal(false);
        done();
      });

      test('Function() x Function() (same body)', done => {
        cmp.gt(F1, F2).should.equal(false);
        done();
      });

      test('Function() x Function() (different body)', done => {
        cmp.gt(F1, G1).should.equal(false);
        done();
      });
    });
  });

  suite('gts', () => {
    suite('any => false', () => {
      test('function x function', done => {
        cmp.gts(f1, f1).should.equal(false);
        done();
      });
    });
  });

  suite('ge', () => {
    suite('equal => true', () => {
      test('function x function', done => {
        cmp.ge(f1, f2).should.equal(true);
        done();
      });

      test('Function() x Function()', done => {
        cmp.ge(F1, F2).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('function x function', done => {
        cmp.ge(f1, g1).should.equal(false);
        done();
      });

      test('function x Function()', done => {
        cmp.ge(f1, F1).should.equal(false);
        done();
      });

      test('Function() x function', done => {
        cmp.ge(F1, f1).should.equal(false);
        done();
      });

      test('Function() x Function()', done => {
        cmp.ge(F1, G1).should.equal(false);
        done();
      });
    });
  });

  suite('ges', () => {
    suite('any => false', () => {
      test('function x function', done => {
        cmp.ges(f1, f1).should.equal(false);
        done();
      });
    });
  });

  suite('lt', () => {
    suite('any => false', () => {
      test('function x function (same body)', done => {
        cmp.lt(f1, f2).should.equal(false);
        done();
      });

      test('function x function (different body)', done => {
        cmp.lt(f1, g1).should.equal(false);
        done();
      });

      test('function x Function()', done => {
        cmp.lt(f1, F1).should.equal(false);
        done();
      });

      test('Function() x function', done => {
        cmp.lt(F1, f1).should.equal(false);
        done();
      });

      test('Function() x Function() (same body)', done => {
        cmp.lt(F1, F2).should.equal(false);
        done();
      });

      test('Function() x Function() (different body)', done => {
        cmp.lt(F1, G1).should.equal(false);
        done();
      });
    });
  });

  suite('lts', () => {
    suite('any => false', () => {
      test('function x function', done => {
        cmp.lts(f1, f1).should.equal(false);
        done();
      });
    });
  });

  suite('le', () => {
    suite('equal => true', () => {
      test('function x function', done => {
        cmp.le(f1, f2).should.equal(true);
        done();
      });

      test('Function() x Function()', done => {
        cmp.le(F1, F2).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('function x function', done => {
        cmp.le(f1, g1).should.equal(false);
        done();
      });

      test('function x Function()', done => {
        cmp.le(f1, F1).should.equal(false);
        done();
      });

      test('Function() x function', done => {
        cmp.le(F1, f1).should.equal(false);
        done();
      });

      test('Function() x Function()', done => {
        cmp.le(F1, G1).should.equal(false);
        done();
      });
    });
  });

  suite('les', () => {
    suite('any => false', () => {
      test('function x function', done => {
        cmp.les(f1, f1).should.equal(false);
        done();
      });
    });
  });

  suite('id', () => {
    suite('equal => true', () => {
      test('function x function', done => {
        cmp.id(f1, f1).should.equal(true);
        done();
      });

      test('Function() x Function()', done => {
        cmp.id(F1, F1).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('function x function (same body)', done => {
        cmp.id(f1, f2).should.equal(false);
        done();
      });

      test('function x function (different body)', done => {
        cmp.id(f1, g1).should.equal(false);
        done();
      });

      test('function x Function()', done => {
        cmp.id(f1, F1).should.equal(false);
        done();
      });

      test('Function() x function', done => {
        cmp.id(F1, f1).should.equal(false);
        done();
      });

      test('Function() x Function() (same body)', done => {
        cmp.id(F1, F2).should.equal(false);
        done();
      });

      test('Function() x Function() (different body)', done => {
        cmp.id(F1, G1).should.equal(false);
        done();
      });
    });
  });
});
