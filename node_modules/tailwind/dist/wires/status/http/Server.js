'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var http = require('http');

var cors = require('cors'),
    express = require('express'),
    flaschenpost = require('flaschenpost'),
    flatten = require('lodash/flatten'),
    lusca = require('lusca'),
    morgan = require('morgan'),
    nocache = require('nocache');

var v1 = require('./v1');

var Server =
/*#__PURE__*/
function () {
  function Server(_ref) {
    var port = _ref.port,
        corsOrigin = _ref.corsOrigin;
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

    this.port = port;
  }

  (0, _createClass2.default)(Server, [{
    key: "link",
    value: function () {
      var _link = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(app, incoming, outgoing) {
        var port, logger, api, server;
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
                port = this.port;
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
                api.use('/v1', v1());
                server = http.createServer(api);
                _context.next = 19;
                return new Promise(function (resolve) {
                  server.listen(port, function () {
                    logger.debug('Started status endpoint.', {
                      port: port
                    });
                    resolve();
                  });
                });

              case 19:
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