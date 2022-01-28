'use strict';

const stream = require('stream');

const assert = require('assertthat'),
      express = require('express'),
      morgan = require('morgan'),
      request = require('supertest');

const flaschenpost = require('../../../src/flaschenpost'),
      letter = require('../../../src/letter'),
      Middleware = require('../../../src/Middleware');

const Writable = stream.Writable;

suite('Middleware', () => {
  setup(() => {
    flaschenpost.initialize();
  });

  test('is a function.', done => {
    assert.that(Middleware).is.ofType('function');
    done();
  });

  test('throws an error if level is missing.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Middleware();
      /* eslint-enable no-new */
    }).is.throwing('Level is missing.');
    done();
  });

  test('throws an error if the specified level does not exist.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Middleware('foo', __filename);
      /* eslint-enable no-new */
    }).is.throwing('Level is invalid.');
    done();
  });

  test('returns a writable stream.', done => {
    assert.that(new Middleware('info', __filename)).is.instanceOf(Writable);
    done();
  });

  test('writes messages using the specified log level.', done => {
    const middleware = new Middleware('info', __filename);

    letter.once('data', data => {
      assert.that(data.level).is.equalTo('info');
      assert.that(data.message).is.equalTo('foobar');
      assert.that(data.application.name).is.equalTo('flaschenpost');
      assert.that(data.application.version).is.not.undefined();
      assert.that(data.module).is.equalTo({
        name: 'foo',
        version: '0.0.1'
      });
      done();
    });

    middleware.write('foobar');
  });

  test('writes messages using the specified log level even if no filename was specified.', done => {
    const app = express();
    let counter = 0;

    app.use(morgan('combined', {
      stream: new Middleware('info')
    }));

    app.get('/', (req, res) => {
      res.send('foobar');
    });

    letter.once('data', data => {
      assert.that(data.module).is.equalTo({
        name: 'foo',
        version: '0.0.1'
      });
      counter += 1;
    });

    request(app).
      get('/').
      end(err => {
        assert.that(err).is.equalTo(null);
        assert.that(counter).is.equalTo(1);
        done();
      });
  });
});
