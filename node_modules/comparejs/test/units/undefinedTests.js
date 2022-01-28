'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('undefined x undefined', () => {
  suite('eq', () => {
    suite('equal => true', () => {
      test('undefined x undefined', done => {
        cmp.eq(undefined, undefined).should.equal(true);
        done();
      });
    });
  });

  suite('eqs', () => {
    suite('any => false', () => {
      test('undefined x undefined', done => {
        cmp.eqs(undefined, undefined).should.equal(false);
        done();
      });
    });
  });

  suite('ne', () => {
    suite('equal => false', () => {
      test('undefined x undefined', done => {
        cmp.ne(undefined, undefined).should.equal(false);
        done();
      });
    });
  });

  suite('nes', () => {
    suite('any => false', () => {
      test('undefined x undefined', done => {
        cmp.nes(undefined, undefined).should.equal(false);
        done();
      });
    });
  });

  suite('gt', () => {
    suite('equal => false', () => {
      test('undefined x undefined', done => {
        cmp.gt(undefined, undefined).should.equal(false);
        done();
      });
    });
  });

  suite('gts', () => {
    suite('any => false', () => {
      test('undefined x undefined', done => {
        cmp.gts(undefined, undefined).should.equal(false);
        done();
      });
    });
  });

  suite('ge', () => {
    suite('equal => true', () => {
      test('undefined x undefined', done => {
        cmp.ge(undefined, undefined).should.equal(true);
        done();
      });
    });
  });

  suite('ges', () => {
    suite('any => false', () => {
      test('undefined x undefined', done => {
        cmp.ges(undefined, undefined).should.equal(false);
        done();
      });
    });
  });

  suite('lt', () => {
    suite('equal => false', () => {
      test('undefined x undefined', done => {
        cmp.lt(undefined, undefined).should.equal(false);
        done();
      });
    });
  });

  suite('lts', () => {
    suite('any => false', () => {
      test('undefined x undefined', done => {
        cmp.lts(undefined, undefined).should.equal(false);
        done();
      });
    });
  });

  suite('le', () => {
    suite('equal => true', () => {
      test('undefined x undefined', done => {
        cmp.le(undefined, undefined).should.equal(true);
        done();
      });
    });
  });

  suite('les', () => {
    suite('any => false', () => {
      test('undefined x undefined', done => {
        cmp.les(undefined, undefined).should.equal(false);
        done();
      });
    });
  });

  suite('id', () => {
    suite('identical => true', () => {
      test('undefined x undefined', done => {
        cmp.id(undefined, undefined).should.equal(true);
        done();
      });
    });
  });
});
