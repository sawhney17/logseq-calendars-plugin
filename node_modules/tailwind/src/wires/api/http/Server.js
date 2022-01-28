'use strict';

const fs = require('fs'),
      http = require('http');

const bodyParser = require('body-parser'),
      compression = require('compression'),
      cors = require('cors'),
      express = require('express'),
      flaschenpost = require('flaschenpost'),
      flatten = require('lodash/flatten'),
      lusca = require('lusca'),
      morgan = require('morgan'),
      nocache = require('nocache');

const v1 = require('./v1'),
      wsServer = require('./wsServer');

class Server {
  constructor ({ port, corsOrigin, readModel, serveStatic, writeModel }) {
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

    if (serveStatic) {
      let staticPath;

      try {
        /* eslint-disable no-sync */
        staticPath = fs.lstatSync(serveStatic);
        /* eslint-enble no-sync */
      } catch (ex) {
        throw new Error('Serve static is not a valid path.');
      }

      if (!staticPath.isDirectory()) {
        throw new Error('Serve static is not a directory.');
      }
    }

    this.port = port;
    this.readModel = readModel;
    this.serveStatic = serveStatic;
    this.writeModel = writeModel;
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

    const { readModel, writeModel, port, serveStatic } = this;

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
    api.use(bodyParser.json({ limit: '100kb' }));

    api.use('/v1', v1(app, { readModel, writeModel }));

    if (serveStatic) {
      api.use(compression());
      api.use('/', express.static(serveStatic));
    }

    const server = http.createServer(api);

    wsServer({ httpServer: server, app, readModel, writeModel });

    await new Promise(resolve => {
      server.listen(port, () => {
        logger.debug('Started API endpoint.', { port });
        resolve();
      });
    });
  }
}

module.exports = Server;
