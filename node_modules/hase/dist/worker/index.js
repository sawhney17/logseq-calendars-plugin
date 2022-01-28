'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _require = require('stream'),
    PassThrough = _require.PassThrough;

var WriteStream = require('./WriteStream');

var Worker =
/*#__PURE__*/
function () {
  function Worker(channel, name) {
    (0, _classCallCheck2.default)(this, Worker);
    this.channel = channel;
    this.name = name;
  }

  (0, _createClass2.default)(Worker, [{
    key: "createWriteStream",
    value: function () {
      var _createWriteStream = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.channel.assertExchange(this.name, 'direct', {
                  durable: true
                });

              case 2:
                _context.next = 4;
                return this.channel.assertQueue(this.name, {
                  durable: true
                });

              case 4:
                _context.next = 6;
                return this.channel.bindQueue(this.name, this.name, '', {});

              case 6:
                return _context.abrupt("return", new WriteStream(this.channel, this.name));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function createWriteStream() {
        return _createWriteStream.apply(this, arguments);
      };
    }()
  }, {
    key: "createReadStream",
    value: function () {
      var _createReadStream = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        var _this = this;

        var readStream;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.channel.assertExchange(this.name, 'direct', {
                  durable: true
                });

              case 2:
                _context2.next = 4;
                return this.channel.assertQueue(this.name, {
                  durable: true
                });

              case 4:
                _context2.next = 6;
                return this.channel.bindQueue(this.name, this.name, '', {});

              case 6:
                readStream = new PassThrough({
                  objectMode: true
                });
                _context2.next = 9;
                return this.channel.consume(this.name, function (message) {
                  var parsedMessage = {};
                  parsedMessage.payload = JSON.parse(message.content.toString('utf8'));

                  parsedMessage.next = function () {
                    _this.channel.ack(message);
                  };

                  parsedMessage.discard = function () {
                    _this.channel.nack(message, false, false);
                  };

                  parsedMessage.defer = function () {
                    _this.channel.nack(message, false, true);
                  };

                  readStream.write(parsedMessage);
                }, {});

              case 9:
                return _context2.abrupt("return", readStream);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function createReadStream() {
        return _createReadStream.apply(this, arguments);
      };
    }()
  }]);
  return Worker;
}();

module.exports = Worker;