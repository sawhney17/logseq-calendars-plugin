'use strict';

const assert = require('assertthat');

const colorize = require('../../../src/formatters/colorize');

suite('colorize', () => {
  test('is a function.', done => {
    assert.that(colorize).is.ofType('function');
    done();
  });

  test('colorizes text with a color.', done => {
    assert.that(colorize('foo', 'red')).is.equalTo('\u001b[31mfoo\u001b[39m');
    done();
  });

  test('colorizes text with a log level.', done => {
    assert.that(colorize('foo', 'info')).is.equalTo('\u001b[32mfoo\u001b[39m');
    done();
  });

  test('colorizes text with styling.', done => {
    assert.that(colorize('foo', 'info', 'bold')).is.equalTo(
      '\u001b[1m\u001b[32mfoo\u001b[39m\u001b[22m'
    );
    done();
  });
});
