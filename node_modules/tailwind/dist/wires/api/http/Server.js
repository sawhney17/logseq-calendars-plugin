'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var fs = require('fs'),
    http = require('http');

var bodyParser = require('body-parser'),
    compression = require('compression'),
    cors = require('cors'),
    express = require('express'),
    flaschenpost = require('flaschenpost'),
    flatten = require('lodash/flatten'),
    lusca = require('lusca'),
    morgan = require('morgan'),
    nocache = require('nocache');

var v1 = require('./v1'),
    wsServer = require('./wsServer');

var Server =
/*#__PURE__*/
function () {
  function Server(_ref) {
    var port = _ref.port,
        corsOrigin = _ref.corsOrigin,
        readModel = _ref.readModel,
        serveStatic = _ref.serveStatic,
        writeModel = _ref.writeModel;
    (0, _classCallCheck2.default)(this, Server);

    if (!port) {
      throw new Error('Port is missing.');
    }

    if (!corsOrigin) {
      throw new Error('CORS origin is missing.');
    }

    if (corsOrigin === '*') {
      this.corsOrigin = corsOrigin;
    } else {
      this.corsOrigin = flatten([corsOrigin]);
    }

    if (serveStatic) {
      var staticPath;

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

  (0, _createClass2.default)(Server, [{
    key: "link",
    value: function () {
      var _link = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(app, incoming, outgoing) {
        var readModel, writeModel, port, serveStatic, logger, api, server;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (app) {
                  _context.next = 2;
                  break;
                }

                throw new Error('App is missing.');

              case 2:
                if (incoming) {
                  _context.next = 4;
                  break;
                }

                throw new Error('Incoming is missing.');

              case 4:
                if (outgoing) {
                  _context.next = 6;
                  break;
                }

                throw new Error('Outgoing is missing.');

              case 6:
                readModel = this.readModel, writeModel = this.writeModel, port = this.port, serveStatic = this.serveStatic;
                logger = app.services.getLogger();
                api = express();
                api.use(morgan('tiny', {
                  stream: new flaschenpost.Middleware('debug')
                }));
                api.use(lusca.xframe('DENY'));
                api.use(lusca.xssProtection());
                api.options('*', cors({
                  methods: ['GET', 'POST'],
                  origin: this.corsOrigin,
                  optionsSuccessStatus: 200
                }));
                api.use(cors({
                  methods: ['GET', 'POST'],
                  origin: this.corsOrigin,
                  optionsSuccessStatus: 200
                }));
                api.use(nocache());
                api.use(bodyParser.json({
                  limit: '100kb'
                }));
                api.use('/v1', v1(app, {
                  readModel: readModel,
                  writeModel: writeModel
                }));

                if (serveStatic) {
                  api.use(compression());
                  api.use('/', express.static(serveStatic));
                }

                server = http.createServer(api);
                wsServer({
                  httpServer: server,
                  app: app,
                  readModel: readModel,
                  writeModel: writeModel
                });
                _context.next = 22;
                return new Promise(function (resolve) {
                  server.listen(port, function () {
                    logger.debug('Started API endpoint.', {
                      port: port
                    });
                    resolve();
                  });
                });

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function link(_x, _x2, _x3) {
        return _link.apply(this, arguments);
      }

      return link;
    }()
  }]);
  return Server;
}();

module.exports = Server;