'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

suite('normalize', () => {
  test('wraps normal text.', done => {
    shell.exec('node writeConsoleLog.js | ../../src/bin/flaschenpost-normalize.js', {
      cwd: path.join(__dirname, '..', 'shared')
    }, (code, stdout, stderr) => {
      assert.that(code).is.equalTo(0);

      const message = JSON.parse(stdout);

      assert.that(message.level).is.equalTo('warn');
      assert.that(message.message).is.equalTo('And now for something completely different...');

      assert.that(stderr).is.equalTo('');
      done();
    });
  });

  test('wraps invalid JSON.', done => {
    shell.exec('node writeInvalidJson.js | ../../src/bin/flaschenpost-normalize.js', {
      cwd: path.join(__dirname, '..', 'shared')
    }, (code, stdout, stderr) => {
      assert.that(code).is.equalTo(0);

      const message = JSON.parse(stdout);

      assert.that(message.level).is.equalTo('warn');
      assert.that(message.message).is.equalTo('{"foo":"bar"');

      assert.that(stderr).is.equalTo('');
      done();
    });
  });

  test('passes through flaschenpost messages.', done => {
    shell.exec('node writeMessages.js | node ../../src/bin/flaschenpost-normalize.js', {
      cwd: path.join(__dirname, '..', 'shared')
    }, (code, stdout, stderr) => {
      assert.that(code).is.equalTo(0);

      const messages = stdout.split('\n').
        filter(line => line !== '').
        map(line => JSON.parse(line));

      assert.that(messages[0].level).is.equalTo('info');
      assert.that(messages[0].message).is.equalTo('Application started.');
      assert.that(messages[1].level).is.equalTo('error');
      assert.that(messages[1].message).is.equalTo('Something, somewhere went horribly wrong...');

      assert.that(stderr).is.equalTo('');
      done();
    });
  });
});
