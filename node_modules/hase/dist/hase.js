'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var amqp = require('amqplib');

var Mq = require('./Mq');

var hase = {};
hase.connect =
/*#__PURE__*/
(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var _ref2,
      url,
      _ref2$prefetch,
      prefetch,
      connection,
      channel,
      _args = arguments;

  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, url = _ref2.url, _ref2$prefetch = _ref2.prefetch, prefetch = _ref2$prefetch === void 0 ? 1 : _ref2$prefetch;

          if (url) {
            _context.next = 3;
            break;
          }

          throw new Error('Url is missing.');

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return amqp.connect(url, {});

        case 6:
          connection = _context.sent;
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](3);
          throw new Error("Could not connect to ".concat(url, "."));

        case 12:
          _context.next = 14;
          return connection.createChannel();

        case 14:
          channel = _context.sent;
          channel.prefetch(prefetch);
          return _context.abrupt("return", new Mq(connection, channel));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this, [[3, 9]]);
}));
module.exports = hase;