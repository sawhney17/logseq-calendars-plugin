'use strict';

const Timer = require('timer2');

const Client = require('./Client');

const setupRoute = function ({ heartbeatInterval }) {
  const heartbeatTimer = new Timer(heartbeatInterval * 1000);

  const route = function (callback) {
    return function (req, res) {
      if (req.method !== 'POST' && req.method !== 'OPTIONS') {
        res.writeHead(405, {
          allow: 'POST, OPTIONS'
        });

        return res.end();
      }

      const client = new Client(req, res);

      const sendHeartbeat = function () {
        client.send({ name: 'heartbeat' });
      };

      req.setTimeout(0);
      res.setTimeout(0);

      heartbeatTimer.on('tick', sendHeartbeat);
      res.socket.once('close', () => {
        heartbeatTimer.removeListener('tick', sendHeartbeat);
        client.emit('disconnect');
        client.removeAllListeners();
      });

      const headers = {
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
