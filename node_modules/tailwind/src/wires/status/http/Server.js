'use strict';

const http = require('http');

const cors = require('cors'),
      express = require('express'),
      flaschenpost = require('flaschenpost'),
      flatten = require('lodash/flatten'),
      lusca = require('lusca'),
      morgan = require('morgan'),
      nocache = require('nocache');

const v1 = require('./v1');

class Server {
  constructor ({ port, corsOrigin }) {
    if (!port) {
      throw new Error('Port is missing.');
    }
    if (!corsOrigin) {
      throw new Error('CORS origin is missing.');
    }

    if (corsOrigin === '*') {
      this.corsOrigin = corsOrigin;
    } else {
      this.corsOrigin = flatten([ corsOrigin ]);
    }

    this.port = port;
  }

  async link (app, incoming, outgoing) {
    if (!app) {
      throw new Error('App is missing.');
    }
    if (!incoming) {
      throw new Error('Incoming is missing.');
    }
    if (!outgoing) {
      throw new Error('Outgoing is missing.');
    }

    const { port } = this;

    const logger = app.services.getLogger();

    const api = express();

    api.use(morgan('tiny', {
      stream: new flaschenpost.Middleware('debug')
    }));

    api.use(lusca.xframe('DENY'));
    api.use(lusca.xssProtection());

    api.options('*', cors({
      methods: [ 'GET', 'POST' ],
      origin: this.corsOrigin,
      optionsSuccessStatus: 200
    }));
    api.use(cors({
      methods: [ 'GET', 'POST' ],
      origin: this.corsOrigin,
      optionsSuccessStatus: 200
    }));

    api.use(nocache());

    api.use('/v1', v1());

    const server = http.createServer(api);

    await new Promise(resolve => {
      server.listen(port, () => {
        logger.debug('Started status endpoint.', { port });
        resolve();
      });
    });
  }
}

module.exports = Server;
