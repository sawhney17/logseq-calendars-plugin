'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var fs = require('fs'),
    path = require('path');

var appRoot = require('app-root-path'),
    _require = require('commands-events'),
    Command = _require.Command,
    Event = _require.Event,
    crypto2 = require('crypto2'),
    Datasette = require('datasette'),
    Draht = require('draht'),
    flaschenpost = require('flaschenpost'),
    processenv = require('processenv'),
    Stethoskop = require('stethoskop'),
    Timer = require('timer2');

var IoPort = require('./IoPort');

var TailwindApp =
/*#__PURE__*/
function () {
  function TailwindApp() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$identityProvider = _ref.identityProviders,
        identityProviders = _ref$identityProvider === void 0 ? [] : _ref$identityProvider,
        _ref$profiling = _ref.profiling,
        profiling = _ref$profiling === void 0 ? {} : _ref$profiling;

    (0, _classCallCheck2.default)(this, TailwindApp);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = identityProviders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var identityProvider = _step.value;

        if (!identityProvider.issuer) {
          throw new Error('Identity provider issuer is missing.');
        }

        if (!identityProvider.certificate) {
          throw new Error('Identity provider certificate is missing.');
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    process.on('uncaughtException', function (ex) {
      _this.fail('Application failed unexpectedly.', ex);
    });
    process.on('unhandledRejection', function (ex) {
      _this.fail('Application failed unexpectedly.', ex);
    });
    this.dirname = appRoot.path;
    this.env = processenv;
    /* eslint-disable global-require */

    this.configuration = require(path.join(this.dirname, 'package.json'));
    /* eslint-enable global-require */

    this.name = this.configuration.name;
    this.version = this.configuration.version;
    this.data = new Datasette();
    flaschenpost.use('host', this.name);
    this.logger = flaschenpost.getLogger();
    this.services = {
      bus: new Draht(),
      crypto: crypto2,
      Datasette: Datasette,
      Emitter: Draht,
      getLogger: function getLogger(source) {
        return flaschenpost.getLogger(source);
      },
      stethoskop: new Stethoskop({
        from: {
          application: this.name
        },
        to: {
          host: profiling.host,
          port: profiling.port
        },
        enabled: Boolean(profiling.host)
      }),
      Timer: Timer
    };
    this.identityProviders = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = identityProviders[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _identityProvider = _step2.value;

        /* eslint-disable no-sync */
        this.identityProviders.push({
          issuer: _identityProvider.issuer,
          certificate: fs.readFileSync(_identityProvider.certificate, {
            encoding: 'utf8'
          })
        });
        /* eslint-enable no-sync */
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    this.Command = Command;
    this.Event = Event;
    this.api = new IoPort(this);
    this.api.read =
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              throw new Error('Invalid operation.');

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    this.commandbus = new IoPort(this);
    this.eventbus = new IoPort(this);
    this.flowbus = new IoPort(this);
    this.status = new IoPort(this);
    this.api.outgoing.on('data', function () {// Register an empty event handler to avoid that outgoing data stacks up
      // if no client is connected. In contrast to the other IO ports it is a
      // valid scenario for the API port that no client is connected. Hence,
      // simply consume potential data and throw it away.
    });
    /* eslint-disable global-require*/

    this.wires = {
      api: {
        http: {
          Server: require('./wires/api/http/Server')
        }
      },
      commandbus: {
        amqp: {
          Receiver: require('./wires/commandbus/amqp/Receiver'),
          Sender: require('./wires/commandbus/amqp/Sender')
        }
      },
      eventbus: {
        amqp: {
          Receiver: require('./wires/eventbus/amqp/Receiver'),
          Sender: require('./wires/eventbus/amqp/Sender')
        }
      },
      flowbus: {
        amqp: {
          Receiver: require('./wires/flowbus/amqp/Receiver'),
          Sender: require('./wires/flowbus/amqp/Sender')
        }
      },
      status: {
        http: {
          Server: require('./wires/status/http/Server')
        }
      }
    };
    /* eslint-enable global-require*/
  }

  (0, _createClass2.default)(TailwindApp, [{
    key: "fail",
    value: function fail(message, err) {
      var _this2 = this;

      this.logger.fatal(message, {
        err: err
      }); // Delay exiting the process to give flaschenpost time to write the log
      // message.

      process.nextTick(function () {
        _this2.exit(1);
      });
    }
    /* eslint-disable class-methods-use-this, no-process-exit */

  }, {
    key: "exit",
    value: function exit() {
      var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      process.exit(code);
    }
    /* eslint-enable class-methods-use-this, no-process-exit */

  }]);
  return TailwindApp;
}();

module.exports = TailwindApp;