'use strict';

const stream = require('stream');

const assert = require('assertthat');

const Json = require('../../../src/formatters/Json');

const Transform = stream.Transform;

suite('Json', () => {
  let json;

  suiteSetup(() => {
    json = new Json();
  });

  test('is a transform stream.', done => {
    assert.that(json).is.instanceOf(Transform);
    done();
  });

  test('transforms a paragraph to a serialized JSON string.', done => {
    const paragraph = {
      host: 'example.com',
      pid: 82517,
      id: 0,
      timestamp: 1415024939974,
      level: 'info',
      message: 'App started.',
      process: {
        name: 'app',
        version: '1.2.3'
      },
      module: {
        name: 'foo',
        version: '0.0.1'
      },
      file: 'app.js',
      metadata: {
        foo: 'bar'
      }
    };

    json.once('data', data => {
      assert.that(data).is.equalTo([
        /* eslint-disable nodeca/indent */
        '{',
        '"host":"example.com",',
        '"pid":82517,',
        '"id":0,',
        '"timestamp":1415024939974,',
        '"level":"info",',
        '"message":"App started.",',
        '"process":{',
        '"name":"app",',
        '"version":"1.2.3"',
        '},',
        '"module":{',
        '"name":"foo",',
        '"version":"0.0.1"',
        '},',
        '"file":"app.js",',
        '"metadata":{',
        '"foo":"bar"',
        '}',
        '}\n'
        /* eslint-enable nodeca/indent */
      ].join(''));
      done();
    });

    json.write(paragraph);
  });
});
