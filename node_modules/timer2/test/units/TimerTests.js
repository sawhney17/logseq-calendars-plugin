'use strict';

const assert = require('assertthat');

const Timer = require('../../lib/Timer');

suite('Timer', () => {
  test('is a function.', done => {
    assert.that(Timer).is.ofType('function');
    done();
  });

  test('throws an error if timeout is missing.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Timer();
      /* eslint-enable no-new */
    }).is.throwing('Timeout is missing.');
    done();
  });

  test('returns an event emitter.', done => {
    const timer = new Timer(100);

    assert.that(timer).is.ofType('object');
    assert.that(timer.on).is.ofType('function');
    assert.that(timer.once).is.ofType('function');
    assert.that(timer.removeListener).is.ofType('function');
    timer.destroy();
    done();
  });

  test('emits a \'tick\' event periodically.', done => {
    const timer = new Timer(100);

    let counter = 0;

    timer.on('tick', () => {
      counter += 1;
    });

    setTimeout(() => {
      assert.that(counter).is.equalTo(5);
      timer.destroy();
      done();
    }, 550);
  });

  test('emits a \'tick\' event periodically with variations.', done => {
    const timer = new Timer(100, {
      variation: 50
    });

    let counter = 0;

    timer.on('tick', () => {
      counter += 1;
    });

    setTimeout(() => {
      assert.that(counter).is.between(3, 10);
      timer.destroy();
      done();
    }, 550);
  });

  test('emits a \'tick\' event immediately if requested.', done => {
    const timer = new Timer(100, {
      immediate: true
    });

    let counter = 0;

    timer.on('tick', () => {
      counter += 1;
    });

    setTimeout(() => {
      assert.that(counter).is.equalTo(1);
      timer.destroy();
      done();
    }, 50);
  });

  suite('stop', () => {
    test('is a function.', done => {
      const timer = new Timer(100);

      assert.that(timer.stop).is.ofType('function');
      timer.destroy();
      done();
    });

    test('stops a running timer.', done => {
      const timer = new Timer(100);

      let counter = 0;

      timer.on('tick', () => {
        counter += 1;
      });

      timer.stop();

      setTimeout(() => {
        assert.that(counter).is.equalTo(0);
        timer.destroy();
        done();
      }, 150);
    });

    test('ignores multiple calls.', done => {
      const timer = new Timer(100);

      timer.stop();
      timer.stop();

      timer.destroy();
      done();
    });
  });

  suite('start', () => {
    test('is a function.', done => {
      const timer = new Timer(100);

      assert.that(timer.start).is.ofType('function');
      timer.destroy();
      done();
    });

    test('starts a stopped timer.', done => {
      const timer = new Timer(100);

      let counter = 0;

      timer.on('tick', () => {
        counter += 1;
      });

      timer.stop();
      timer.start();

      setTimeout(() => {
        assert.that(counter).is.equalTo(1);
        timer.destroy();
        done();
      }, 150);
    });

    test('ignores multiple calls.', done => {
      const timer = new Timer(100);

      let counter = 0;

      timer.on('tick', () => {
        counter += 1;
      });

      timer.stop();
      timer.start();
      timer.start();

      setTimeout(() => {
        assert.that(counter).is.equalTo(1);
        timer.destroy();
        done();
      }, 150);
    });
  });

  suite('destroy', () => {
    test('is a function.', done => {
      const timer = new Timer(100);

      assert.that(timer.destroy).is.ofType('function');
      timer.destroy();
      done();
    });

    test('stops a running timer.', done => {
      const timer = new Timer(100);

      let counter = 0;

      timer.on('tick', () => {
        counter += 1;
      });

      timer.destroy();

      timer.on('tick', () => {
        counter += 1;
      });

      setTimeout(() => {
        assert.that(counter).is.equalTo(0);
        timer.destroy();
        done();
      }, 150);
    });

    test('removes all event listeners.', done => {
      const timer = new Timer(100);

      let counter = 0;

      timer.on('tick', () => {
        counter += 1;
      });

      timer.destroy();
      timer.start();

      setTimeout(() => {
        assert.that(counter).is.equalTo(0);
        timer.destroy();
        done();
      }, 150);
    });
  });
});
