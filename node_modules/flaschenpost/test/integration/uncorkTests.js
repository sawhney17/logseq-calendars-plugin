'use strict';

const path = require('path');

const assert = require('assertthat'),
      defaults = require('lodash/defaults'),
      shell = require('shelljs');

const humanReadableMessage = /^.+ \(.+\)\n.+::.+@\d+\.\d+\.\d+.* \(.+\)\n\d{2}:\d{2}:\d{2}\.\d{3}@\d{4}-\d{2}-\d{2} \d+#\d+\n([^─]*)?─+$/gm;

suite('uncork', () => {
  test('humanizes messages.', done => {
    shell.exec('FLASCHENPOST_FORMATTER=json node writeMessages.js | node ../../src/bin/flaschenpost-uncork.js', {
      cwd: path.join(__dirname, '..', 'shared'),
      /* eslint-disable no-process-env */
      env: defaults({
        FLASCHENPOST_FORMATTER: 'human'
      }, process.env)
      /* eslint-enable no-process-env */
    }, (code, stdout, stderr) => {
      assert.that(code).is.equalTo(0);

      const matches = stdout.match(humanReadableMessage);

      assert.that(matches.length).is.equalTo(2);
      assert.that(stderr).is.equalTo('');
      done();
    });
  });
});
