'use strict';

const assert = require('assertthat');

const throwOnUnknownProperties = require('../../lib/throwOnUnknownProperties');

suite('throwOnUnknownProperties', () => {
  test('is a function.', done => {
    assert.that(throwOnUnknownProperties).is.ofType('function');
    done();
  });

  test('throws if options are missing.', done => {
    assert.that(() => {
      throwOnUnknownProperties();
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws if properties are missing.', done => {
    assert.that(() => {
      throwOnUnknownProperties({ foo: 'bar' });
    }).is.throwing('Properties are missing.');
    done();
  });

  test('throws if options have properties not expected.', done => {
    assert.that(() => {
      throwOnUnknownProperties({ foo: 'bar' }, [ 'baz' ]);
    }).is.throwing('Unknown property foo.');
    done();
  });

  test('does not throw if options have properties as expected.', done => {
    assert.that(() => {
      throwOnUnknownProperties({ foo: 'bar' }, [ 'foo' ]);
    }).is.not.throwing();
    done();
  });

  test('does not throw if options have less properties than expected.', done => {
    assert.that(() => {
      throwOnUnknownProperties({ foo: 'bar' }, [ 'foo', 'baz' ]);
    }).is.not.throwing();
    done();
  });
});
