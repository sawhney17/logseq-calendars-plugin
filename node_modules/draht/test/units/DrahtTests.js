'use strict';

const assert = require('assertthat');

const Draht = require('../../lib/Draht');

suite('Draht', () => {
  test('returns an event emitter.', done => {
    const draht = new Draht();

    assert.that(draht).is.ofType('object');
    assert.that(draht.on).is.ofType('function');
    assert.that(draht.once).is.ofType('function');
    assert.that(draht.emit).is.ofType('function');
    assert.that(draht.removeListener).is.ofType('function');
    assert.that(draht.removeAllListeners).is.ofType('function');
    done();
  });

  test('does not return the global instance.', done => {
    const draht = new Draht();

    assert.that(draht).is.not.sameAs(Draht.instance);
    done();
  });

  test('returns a new instance each time.', done => {
    const draht1 = new Draht(),
          draht2 = new Draht();

    assert.that(draht1).is.not.sameAs(draht2);
    done();
  });

  suite('instance', () => {
    test('returns an event emitter.', done => {
      const draht = Draht.instance;

      assert.that(draht).is.ofType('object');
      assert.that(draht.on).is.ofType('function');
      assert.that(draht.once).is.ofType('function');
      assert.that(draht.emit).is.ofType('function');
      assert.that(draht.removeListener).is.ofType('function');
      assert.that(draht.removeAllListeners).is.ofType('function');
      done();
    });

    test('returns always the very same instance.', done => {
      const draht1 = Draht.instance,
            draht2 = Draht.instance;

      assert.that(draht1).is.sameAs(draht2);
      done();
    });
  });
});
