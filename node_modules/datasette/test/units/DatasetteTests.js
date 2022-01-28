'use strict';

const assert = require('assertthat'),
      cases = require('cases');

const Datasette = require('../../lib/Datasette');

suite('Datasette', () => {
  test('returns a new datasette instance.', done => {
    const datasette = new Datasette();

    assert.that(datasette.get).is.ofType('function');
    assert.that(datasette.set).is.ofType('function');
    assert.that(datasette.emit).is.ofType('function');
    assert.that(datasette.on).is.ofType('function');
    assert.that(datasette.once).is.ofType('function');
    assert.that(datasette.off).is.ofType('function');
    done();
  });

  suite('get', () => {
    test('returns undefined for a key that has not been set.', done => {
      const datasette = new Datasette();

      assert.that(datasette.get('foo')).is.undefined();
      done();
    });

    test('returns the value for a key that has been set.', cases([
      [ 'foo', 'bar' ],
      [ 'bar', 23 ],
      [ 'baz', true ]
    ], (key, value, done) => {
      const datasette = new Datasette();

      datasette.set(key, value);
      assert.that(datasette.get(key)).is.equalTo(value);
      done();
    }));

    test('returns a new reference each time.', done => {
      const datasette = new Datasette();

      datasette.set('foo', { bar: 'baz' });
      assert.that(datasette.get('foo')).is.not.sameAs(datasette.get('foo'));
      done();
    });

    test('returns a deep-cloned object.', done => {
      const datasette = new Datasette();
      const foo = [ 'bar' ];

      datasette.set('foo', foo);
      foo.push('baz');

      assert.that(datasette.get('foo')).is.equalTo([ 'bar' ]);
      done();
    });
  });

  suite('set', () => {
    test('stores the given key and value.', cases([
      [ 'foo', 'bar' ],
      [ 'bar', 23 ],
      [ 'baz', true ]
    ], (key, value, done) => {
      const datasette = new Datasette();

      datasette.set(key, value);
      assert.that(datasette.get(key)).is.equalTo(value);
      done();
    }));

    test('emits a changed event.', done => {
      const datasette = new Datasette();
      const input = { bar: 'baz' };

      datasette.once('changed', (key, value) => {
        assert.that(key).is.equalTo('foo');
        assert.that(value).is.equalTo(input);
        done();
      });
      datasette.set('foo', input);
    });

    test('emits a changed::* event.', cases([
      [ 'foo' ],
      [ 'bar' ],
      [ 'baz' ]
    ], (key, done) => {
      const datasette = new Datasette();
      const value = { bar: 'baz' };

      datasette.once(`changed::${key}`, actual => {
        assert.that(actual).is.equalTo(value);
        done();
      });
      datasette.set(key, value);
    }));

    test('does not emit a changed event if the value has not been changed.', done => {
      const datasette = new Datasette();
      let changedCounter = 0;

      datasette.set('foo', { bar: 'baz' });
      datasette.once('changed', () => {
        changedCounter += 1;
      });
      datasette.set('foo', { bar: 'baz' });
      setTimeout(() => {
        assert.that(changedCounter).is.equalTo(0);
        done();
      }, 25);
    });

    test('does not emit a changed event if silent is set to true.', done => {
      const datasette = new Datasette();
      let changedCounter = 0;

      datasette.once('changed', () => {
        changedCounter += 1;
      });
      datasette.set('foo', 'bar', { silent: true });
      setTimeout(() => {
        assert.that(changedCounter).is.equalTo(0);
        done();
      }, 25);
    });

    test('does not emit a changed::* event if the value has not been changed.', done => {
      const datasette = new Datasette();
      let changedCounter = 0;

      datasette.set('foo', { bar: 'baz' });
      datasette.once('changed::foo', () => {
        changedCounter += 1;
      });
      datasette.set('foo', { bar: 'baz' });
      setTimeout(() => {
        assert.that(changedCounter).is.equalTo(0);
        done();
      }, 25);
    });

    test('does not emit a changed::* event if silent is set to true.', done => {
      const datasette = new Datasette();
      let changedCounter = 0;

      datasette.set('foo', { bar: 'baz' });
      datasette.once('changed::foo', () => {
        changedCounter += 1;
      });
      datasette.set('foo', { bar: 'baz' }, { silent: true });
      setTimeout(() => {
        assert.that(changedCounter).is.equalTo(0);
        done();
      }, 25);
    });

    test('hands over a new reference on a changed event.', done => {
      const datasette = new Datasette();
      const input = { bar: 'baz' };

      datasette.once('changed', (key, value) => {
        assert.that(value).is.not.sameAs(input);
        done();
      });
      datasette.set('foo', input);
    });

    test('hands over a new reference on a changed::* event.', done => {
      const datasette = new Datasette();
      const input = { bar: 'baz' };

      datasette.once('changed::foo', value => {
        assert.that(value).is.not.sameAs(input);
        done();
      });
      datasette.set('foo', input);
    });

    test('updates a key that had been set before.', done => {
      const datasette = new Datasette();

      datasette.set('foo', 'bar');
      datasette.set('foo', 'baz');
      assert.that(datasette.get('foo')).is.equalTo('baz');
      done();
    });

    test('removes a key when value is missing.', done => {
      const datasette = new Datasette();

      datasette.set('foo', 'bar');
      datasette.set('foo');
      assert.that(datasette.get('foo')).is.undefined();
      done();
    });

    test('sets multiple key value pairs at once.', done => {
      const datasette = new Datasette();

      datasette.set({
        foo: 'bar',
        baz: 'bat'
      });
      assert.that(datasette.get('foo')).is.equalTo('bar');
      assert.that(datasette.get('baz')).is.equalTo('bat');
      done();
    });
  });
});
