'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('mixed types', () => {
  const fn = function () {
    return 23;
  };

  const fAsString = 'function () { return 23; }';

  suite('eq', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.eq(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.eq(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.eq('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.eq(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('eqs', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.eqs(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.eqs(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.eqs('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.eqs(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('ne', () => {
    suite('any => true', () => {
      test('number x string', done => {
        cmp.ne(0, '').should.equal(true);
        done();
      });

      test('number x boolean', done => {
        cmp.ne(0, false).should.equal(true);
        done();
      });

      test('string x boolean', done => {
        cmp.ne('', false).should.equal(true);
        done();
      });

      test('function x string', done => {
        cmp.ne(fn, fAsString).should.equal(true);
        done();
      });
    });
  });

  suite('nes', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.nes(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.nes(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.nes('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.nes(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('gt', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.gt(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.gt(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.gt('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.gt(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('gts', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.gts(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.gts(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.gts('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.gts(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('ge', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.ge(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.ge(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.ge('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.ge(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('ges', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.ges(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.ges(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.ges('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.ges(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('lt', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.lt(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.lt(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.lt('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.lt(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('lts', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.lts(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.lts(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.lts('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.lts(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('le', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.le(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.le(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.le('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.le(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('les', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.les(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.les(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.les('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.les(fn, fAsString).should.equal(false);
        done();
      });
    });
  });

  suite('id', () => {
    suite('any => false', () => {
      test('number x string', done => {
        cmp.id(0, '').should.equal(false);
        done();
      });

      test('number x boolean', done => {
        cmp.id(0, false).should.equal(false);
        done();
      });

      test('string x boolean', done => {
        cmp.id('', false).should.equal(false);
        done();
      });

      test('function x string', done => {
        cmp.id(fn, fAsString).should.equal(false);
        done();
      });
    });
  });
});
