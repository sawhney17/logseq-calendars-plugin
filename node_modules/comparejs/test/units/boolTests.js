'use strict';

/* eslint-disable no-unused-vars */
const should = require('should');
/* eslint-enable no-unused-vars */

const cmp = require('../../lib/compare');

suite('bool x bool', () => {
  /* eslint-disable no-new-wrappers */
  const False = new Boolean(false),
        True = new Boolean(true);
  /* eslint-enable no-new-wrappers */

  suite('eq', () => {
    suite('equal => true', () => {
      test('true x true', done => {
        cmp.eq(true, true).should.equal(true);
        done();
      });

      test('true x True()', done => {
        cmp.eq(true, True).should.equal(true);
        done();
      });

      test('True() x true', done => {
        cmp.eq(True, true).should.equal(true);
        done();
      });

      test('True() x True()', done => {
        cmp.eq(True, True).should.equal(true);
        done();
      });

      test('false x false', done => {
        cmp.eq(false, false).should.equal(true);
        done();
      });

      test('false x False()', done => {
        cmp.eq(false, False).should.equal(true);
        done();
      });

      test('False() x false', done => {
        cmp.eq(False, false).should.equal(true);
        done();
      });

      test('False() x False()', done => {
        cmp.eq(False, False).should.equal(true);
        done();
      });
    });

    suite('not equal => false', () => {
      test('true x false', done => {
        cmp.eq(true, false).should.equal(false);
        done();
      });

      test('true x False()', done => {
        cmp.eq(true, False).should.equal(false);
        done();
      });

      test('True() x false', done => {
        cmp.eq(True, false).should.equal(false);
        done();
      });

      test('True() x False()', done => {
        cmp.eq(True, False).should.equal(false);
        done();
      });

      test('false x true', done => {
        cmp.eq(false, true).should.equal(false);
        done();
      });

      test('false x True()', done => {
        cmp.eq(false, True).should.equal(false);
        done();
      });

      test('False() x true', done => {
        cmp.eq(False, true).should.equal(false);
        done();
      });

      test('False() x True()', done => {
        cmp.eq(False, True).should.equal(false);
        done();
      });
    });
  });

  suite('eqs', () => {
    suite('any => false', () => {
      test('true x true', done => {
        cmp.eqs(true, true).should.equal(false);
        done();
      });
    });
  });

  suite('ne', () => {
    suite('equal => false', () => {
      test('true x true', done => {
        cmp.ne(true, true).should.equal(false);
        done();
      });

      test('true x True()', done => {
        cmp.ne(true, True).should.equal(false);
        done();
      });

      test('True() x true', done => {
        cmp.ne(True, true).should.equal(false);
        done();
      });

      test('True() x True()', done => {
        cmp.ne(True, True).should.equal(false);
        done();
      });

      test('false x false', done => {
        cmp.ne(false, false).should.equal(false);
        done();
      });

      test('false x False()', done => {
        cmp.ne(false, False).should.equal(false);
        done();
      });

      test('False() x false', done => {
        cmp.ne(False, false).should.equal(false);
        done();
      });

      test('False() x False()', done => {
        cmp.ne(False, False).should.equal(false);
        done();
      });
    });

    suite('not equal => true', () => {
      test('true x false', done => {
        cmp.ne(true, false).should.equal(true);
        done();
      });

      test('true x False()', done => {
        cmp.ne(true, False).should.equal(true);
        done();
      });

      test('True() x false', done => {
        cmp.ne(True, false).should.equal(true);
        done();
      });

      test('True() x False()', done => {
        cmp.ne(True, False).should.equal(true);
        done();
      });

      test('false x true', done => {
        cmp.ne(false, true).should.equal(true);
        done();
      });

      test('false x True()', done => {
        cmp.ne(false, True).should.equal(true);
        done();
      });

      test('False() x true', done => {
        cmp.ne(False, true).should.equal(true);
        done();
      });

      test('False() x True()', done => {
        cmp.ne(False, True).should.equal(true);
        done();
      });
    });
  });

  suite('nes', () => {
    suite('any => false', () => {
      test('true x true', done => {
        cmp.nes(true, true).should.equal(false);
        done();
      });
    });
  });

  suite('gt', () => {
    suite('greater => true', () => {
      test('true x false', done => {
        cmp.gt(true, false).should.equal(true);
        done();
      });

      test('true x False()', done => {
        cmp.gt(true, False).should.equal(true);
        done();
      });

      test('True() x false', done => {
        cmp.gt(True, false).should.equal(true);
        done();
      });

      test('True() x False()', done => {
        cmp.gt(True, False).should.equal(true);
        done();
      });
    });

    suite('equal => false', () => {
      test('true x true', done => {
        cmp.gt(true, true).should.equal(false);
        done();
      });

      test('true x True()', done => {
        cmp.gt(true, True).should.equal(false);
        done();
      });

      test('True() x true', done => {
        cmp.gt(True, true).should.equal(false);
        done();
      });

      test('True() x True()', done => {
        cmp.gt(True, True).should.equal(false);
        done();
      });

      test('false x false', done => {
        cmp.gt(false, false).should.equal(false);
        done();
      });

      test('false x False()', done => {
        cmp.gt(false, False).should.equal(false);
        done();
      });

      test('False() x false', done => {
        cmp.gt(False, false).should.equal(false);
        done();
      });

      test('False() x False()', done => {
        cmp.gt(False, False).should.equal(false);
        done();
      });
    });

    suite('less => false', () => {
      test('false x true', done => {
        cmp.gt(false, true).should.equal(false);
        done();
      });

      test('false x True()', done => {
        cmp.gt(false, True).should.equal(false);
        done();
      });

      test('False() x true', done => {
        cmp.gt(False, true).should.equal(false);
        done();
      });

      test('False() x True()', done => {
        cmp.gt(False, True).should.equal(false);
        done();
      });
    });
  });

  suite('gts', () => {
    suite('any => false', () => {
      test('true x true', done => {
        cmp.gts(true, true).should.equal(false);
        done();
      });
    });
  });

  suite('ge', () => {
    suite('greater => true', () => {
      test('true x false', done => {
        cmp.ge(true, false).should.equal(true);
        done();
      });

      test('true x False()', done => {
        cmp.ge(true, False).should.equal(true);
        done();
      });

      test('True() x false', done => {
        cmp.ge(True, false).should.equal(true);
        done();
      });

      test('True() x False()', done => {
        cmp.ge(True, False).should.equal(true);
        done();
      });
    });

    suite('equal => true', () => {
      test('true x true', done => {
        cmp.ge(true, true).should.equal(true);
        done();
      });

      test('true x True()', done => {
        cmp.ge(true, True).should.equal(true);
        done();
      });

      test('True() x true', done => {
        cmp.ge(True, true).should.equal(true);
        done();
      });

      test('True() x True()', done => {
        cmp.ge(True, True).should.equal(true);
        done();
      });

      test('false x false', done => {
        cmp.ge(false, false).should.equal(true);
        done();
      });

      test('false x False()', done => {
        cmp.ge(false, False).should.equal(true);
        done();
      });

      test('False() x false', done => {
        cmp.ge(False, false).should.equal(true);
        done();
      });

      test('False() x False()', done => {
        cmp.ge(False, False).should.equal(true);
        done();
      });
    });

    suite('less => false', () => {
      test('false x true', done => {
        cmp.ge(false, true).should.equal(false);
        done();
      });

      test('false x True()', done => {
        cmp.ge(false, True).should.equal(false);
        done();
      });

      test('False() x true', done => {
        cmp.ge(False, true).should.equal(false);
        done();
      });

      test('False() x True()', done => {
        cmp.ge(False, True).should.equal(false);
        done();
      });
    });
  });

  suite('ges', () => {
    suite('any => false', () => {
      test('true x true', done => {
        cmp.ges(true, true).should.equal(false);
        done();
      });
    });
  });

  suite('lt', () => {
    suite('greater => false', () => {
      test('true x false', done => {
        cmp.lt(true, false).should.equal(false);
        done();
      });

      test('true x False()', done => {
        cmp.lt(true, False).should.equal(false);
        done();
      });

      test('True() x false', done => {
        cmp.lt(True, false).should.equal(false);
        done();
      });

      test('True() x False()', done => {
        cmp.lt(True, False).should.equal(false);
        done();
      });
    });

    suite('equal => false', () => {
      test('true x true', done => {
        cmp.lt(true, true).should.equal(false);
        done();
      });

      test('true x True()', done => {
        cmp.lt(true, True).should.equal(false);
        done();
      });

      test('True() x true', done => {
        cmp.lt(True, true).should.equal(false);
        done();
      });

      test('True() x True()', done => {
        cmp.lt(True, True).should.equal(false);
        done();
      });

      test('false x false', done => {
        cmp.lt(false, false).should.equal(false);
        done();
      });

      test('false x False()', done => {
        cmp.lt(false, False).should.equal(false);
        done();
      });

      test('False() x false', done => {
        cmp.lt(False, false).should.equal(false);
        done();
      });

      test('False() x False()', done => {
        cmp.lt(False, False).should.equal(false);
        done();
      });
    });

    suite('less => true', () => {
      test('false x true', done => {
        cmp.lt(false, true).should.equal(true);
        done();
      });

      test('false x True()', done => {
        cmp.lt(false, True).should.equal(true);
        done();
      });

      test('False() x true', done => {
        cmp.lt(False, true).should.equal(true);
        done();
      });

      test('False() x True()', done => {
        cmp.lt(False, True).should.equal(true);
        done();
      });
    });
  });

  suite('lts', () => {
    suite('any => false', () => {
      test('true x true', done => {
        cmp.lts(true, true).should.equal(false);
        done();
      });
    });
  });

  suite('le', () => {
    suite('greater => false', () => {
      test('true x false', done => {
        cmp.le(true, false).should.equal(false);
        done();
      });

      test('true x False()', done => {
        cmp.le(true, False).should.equal(false);
        done();
      });

      test('True() x false', done => {
        cmp.le(True, false).should.equal(false);
        done();
      });

      test('True() x False()', done => {
        cmp.le(True, False).should.equal(false);
        done();
      });
    });

    suite('equal => true', () => {
      test('true x true', done => {
        cmp.le(true, true).should.equal(true);
        done();
      });

      test('true x True()', done => {
        cmp.le(true, True).should.equal(true);
        done();
      });

      test('True() x true', done => {
        cmp.le(True, true).should.equal(true);
        done();
      });

      test('True() x True()', done => {
        cmp.le(True, True).should.equal(true);
        done();
      });

      test('false x false', done => {
        cmp.le(false, false).should.equal(true);
        done();
      });

      test('false x False()', done => {
        cmp.le(false, False).should.equal(true);
        done();
      });

      test('False() x false', done => {
        cmp.le(False, false).should.equal(true);
        done();
      });

      test('False() x False()', done => {
        cmp.le(False, False).should.equal(true);
        done();
      });
    });

    suite('less => true', () => {
      test('false x true', done => {
        cmp.le(false, true).should.equal(true);
        done();
      });

      test('false x True()', done => {
        cmp.le(false, True).should.equal(true);
        done();
      });

      test('False() x true', done => {
        cmp.le(False, true).should.equal(true);
        done();
      });

      test('False() x True()', done => {
        cmp.le(False, True).should.equal(true);
        done();
      });
    });
  });

  suite('les', () => {
    suite('any => false', () => {
      test('true x true', done => {
        cmp.les(true, true).should.equal(false);
        done();
      });
    });
  });

  suite('id', () => {
    suite('identical => true', () => {
      test('true x true', done => {
        cmp.id(true, true).should.equal(true);
        done();
      });

      test('true x True()', done => {
        cmp.id(true, True).should.equal(true);
        done();
      });

      test('True() x true', done => {
        cmp.id(True, true).should.equal(true);
        done();
      });

      test('True() x True()', done => {
        cmp.id(True, True).should.equal(true);
        done();
      });

      test('false x false', done => {
        cmp.id(false, false).should.equal(true);
        done();
      });

      test('false x False()', done => {
        cmp.id(false, False).should.equal(true);
        done();
      });

      test('False() x false', done => {
        cmp.id(False, false).should.equal(true);
        done();
      });

      test('False() x False()', done => {
        cmp.id(False, False).should.equal(true);
        done();
      });
    });

    suite('not identical => false', () => {
      test('true x false', done => {
        cmp.id(true, false).should.equal(false);
        done();
      });

      test('true x False()', done => {
        cmp.id(true, False).should.equal(false);
        done();
      });

      test('True() x false', done => {
        cmp.id(True, false).should.equal(false);
        done();
      });

      test('True() x False()', done => {
        cmp.id(True, False).should.equal(false);
        done();
      });

      test('false x true', done => {
        cmp.id(false, true).should.equal(false);
        done();
      });

      test('false x True()', done => {
        cmp.id(false, True).should.equal(false);
        done();
      });

      test('False() x true', done => {
        cmp.id(False, true).should.equal(false);
        done();
      });

      test('False() x True()', done => {
        cmp.id(False, True).should.equal(false);
        done();
      });
    });
  });
});
