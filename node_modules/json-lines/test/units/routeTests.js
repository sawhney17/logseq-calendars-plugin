'use strict';

const http = require('http');

const assert = require('assertthat'),
      bodyParser = require('body-parser'),
      express = require('express'),
      Timer = require('timer2');

const route = require('../../lib/route')({ heartbeatInterval: 1.5 });

suite('route', () => {
  let app,
      port = 3000;

  setup(() => {
    app = express();
    app.use(bodyParser.json());

    port += 1;
    http.createServer(app).listen(port);
  });

  test('is a function.', done => {
    assert.that(route).is.ofType('function');
    done();
  });

  test('returns a 405 if GET is used.', done => {
    app.get('/', route(() => {
      // Intentionally left blank...
    }));

    http.request({
      method: 'GET',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      assert.that(res.statusCode).is.equalTo(405);
      assert.that(res.headers.allow).is.equalTo('POST, OPTIONS');
      done();
    }).end();
  });

  test('emits a connect event when the client connects.', done => {
    app.post('/', route(client => {
      client.once('connect', () => {
        done();
      });
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      setTimeout(() => {
        res.socket.end();
        res.removeAllListeners();
      }, 0.5 * 1000);
    }).end();
  });

  test('passes the request body to the client object.', done => {
    app.post('/', route(client => {
      client.once('connect', () => {
        assert.that(client.req.body).is.equalTo({ foo: 'bar' });
        done();
      });
    }));

    const req = http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/',
      headers: {
        'content-type': 'application/json'
      }
    }, res => {
      setTimeout(() => {
        res.socket.end();
        res.removeAllListeners();
      }, 0.5 * 1000);
    });

    req.write(JSON.stringify({ foo: 'bar' }));
    req.end();
  });

  test('emits a disconnect event when the client disconnects.', done => {
    app.post('/', route(client => {
      client.once('disconnect', () => {
        done();
      });
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      setTimeout(() => {
        res.socket.end();
        res.removeAllListeners();
      }, 0.5 * 1000);
    }).end();
  });

  test('is able to disconnect a client.', done => {
    app.post('/', route(client => {
      client.once('connect', () => {
        client.send({ foo: 'bar' });
        client.disconnect();
      });
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      res.once('data', data1 => {
        res.once('data', data2 => {
          res.once('end', () => {
            done();
          });
          assert.that(JSON.parse(data2.toString())).is.equalTo({ foo: 'bar' });
        });
        assert.that(JSON.parse(data1.toString())).is.equalTo({ name: 'heartbeat' });
      });
    }).end();
  });

  test('emits a disconnect event when the client is disconnected from the server.', done => {
    app.post('/', route(client => {
      client.once('connect', () => {
        client.disconnect();
      });

      client.once('disconnect', () => {
        done();
      });
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      setTimeout(() => {
        res.socket.end();
        res.removeAllListeners();
      }, 0.5 * 1000);
    }).end();
  });

  test('cleans up when the client disconnects.', done => {
    app.post('/', route(client => {
      client.on('connect', () => {
        // Intentionally left blank...
      });

      client.on('disconnect', () => {
        process.nextTick(() => {
          assert.that(client.listeners('connect').length).is.equalTo(0);
          assert.that(client.listeners('disconnect').length).is.equalTo(0);
          done();
        });
      });
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      setTimeout(() => {
        res.socket.end();
        res.removeAllListeners();
      }, 500);
    }).end();
  });

  test('sends heartbeats.', function (done) {
    let counter = 0;

    this.timeout(5 * 1000);

    app.post('/', route(() => {
      // Intentionally left blank ;-)
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      res.on('data', data => {
        const result = JSON.parse(data.toString());

        assert.that(result.name).is.equalTo('heartbeat');
        counter += 1;

        if (counter === 3) {
          res.socket.end();
          res.removeAllListeners();

          return done();
        }
      });
    }).end();
  });

  test('immediately sends the first heartbeat.', done => {
    app.post('/', route(() => {
      // Intentionally left blank ;-)
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      res.on('data', data => {
        const result = JSON.parse(data.toString());

        assert.that(result.name).is.equalTo('heartbeat');
        res.socket.end();
        res.removeAllListeners();

        return done();
      });
    }).end();
  });

  test('streams data.', done => {
    app.post('/', route(client => {
      const timer = new Timer(100);

      let counter = 0;

      client.once('connect', () => {
        timer.on('tick', () => {
          client.send({ counter });
          counter += 1;
        });
      });

      client.once('disconnect', () => {
        timer.destroy();
      });
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      res.on('data', data => {
        const result = JSON.parse(data.toString());

        if (result.name === 'heartbeat') {
          return;
        }
        assert.that(result.counter).is.between(0, 9);

        if (result.counter === 9) {
          res.socket.end();
          res.removeAllListeners();

          return done();
        }
      });
    }).end();
  });

  test('handles newlines in data gracefully.', done => {
    app.post('/', route(client => {
      client.once('connect', () => {
        client.send({ text: 'foo\nbar' });
      });
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      res.on('data', data => {
        const result = JSON.parse(data.toString());

        if (result.name === 'heartbeat') {
          return;
        }
        assert.that(result).is.equalTo({ text: 'foo\nbar' });

        res.socket.end();
        res.removeAllListeners();
        done();
      });
    }).end();
  });

  test('throws an error if data is not an object.', done => {
    app.post('/', route(client => {
      client.once('connect', () => {
        assert.that(() => {
          client.send(undefined);
        }).is.throwing();
        done();
      });
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      setTimeout(() => {
        res.socket.end();
        res.removeAllListeners();
      }, 500);
    }).end();
  });

  test('throws an error if data is null.', done => {
    app.post('/', route(client => {
      client.once('connect', () => {
        assert.that(() => {
          client.send(null);
        }).is.throwing();
        done();
      });
    }));

    http.request({
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/'
    }, res => {
      setTimeout(() => {
        res.socket.end();
        res.removeAllListeners();
      }, 500);
    }).end();
  });
});
