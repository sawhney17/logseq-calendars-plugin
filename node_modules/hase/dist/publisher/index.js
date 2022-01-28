'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _require = require('stream'),
    PassThrough = _require.PassThrough;

var WriteStream = require('./WriteStream');

var Publisher =
/*#__PURE__*/
function () {
  function Publisher(channel, name) {
    (0, _classCallCheck2.default)(this, Publisher);
    this.channel = channel;
    this.name = name;
  }

  (0, _createClass2.default)(Publisher, [{
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
                return this.channel.assertExchange(this.name, 'fanout', {
                  durable: true
                });

              case 2:
                return _context.abrupt("return", new WriteStream(this.channel, this.name));

              case 3:
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

        var ok, generatedQueueName, readStream;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.channel.assertExchange(this.name, 'fanout', {
                  durable: true
                });

              case 2:
                _context2.next = 4;
                return this.channel.assertQueue('', {
                  autoDelete: true,
                  exclusive: true
                });

              case 4:
                ok = _context2.sent;
                generatedQueueName = ok.queue;
                _context2.next = 8;
                return this.channel.bindQueue(generatedQueueName, this.name, '', {});

              case 8:
                readStream = new PassThrough({
                  objectMode: true
                });
                _context2.next = 11;
                return this.channel.consume(generatedQueueName, function (message) {
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

              case 11:
                return _context2.abrupt("return", readStream);

              case 12:
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
  return Publisher;
}();

module.exports = Publisher;