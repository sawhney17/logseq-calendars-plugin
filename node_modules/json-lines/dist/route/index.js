'use strict';

var Timer = require('timer2');

var Client = require('./Client');

var setupRoute = function setupRoute(_ref) {
  var heartbeatInterval = _ref.heartbeatInterval;

  var heartbeatTimer = new Timer(heartbeatInterval * 1000);

  var route = function route(callback) {
    return function (req, res) {
      if (req.method !== 'POST' && req.method !== 'OPTIONS') {
        res.writeHead(405, {
          allow: 'POST, OPTIONS'
        });

        return res.end();
      }

      var client = new Client(req, res);

      var sendHeartbeat = function sendHeartbeat() {
        client.send({ name: 'heartbeat' });
      };

      req.setTimeout(0);
      res.setTimeout(0);

      heartbeatTimer.on('tick', sendHeartbeat);
      res.socket.once('close', function () {
        heartbeatTimer.removeListener('tick', sendHeartbeat);
        client.emit('disconnect');
        client.removeAllListeners();
      });

      var headers = {
        'content-type': 'application/json'
      };

      // The transfer-encoding: chunked header is forbidden in HTTP/2.
      if (!req.isSpdy) {
        headers['transfer-encoding'] = 'chunked';
      }

      res.writeHead(200, headers);

      // Send an initial heartbeat to initialize the connection. If we do not
      // do this, sometimes the connection does not become open until the first
      // data is sent.
      sendHeartbeat();

      /* eslint-disable callback-return */
      callback(client);
      /* eslint-enable callback-return */
      client.emit('connect');
    };
  };

  return route;
};

module.exports = setupRoute;