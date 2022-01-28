'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var hase = require('hase'),
    retry = require('async-retry');

var Receiver =
/*#__PURE__*/
function () {
  function Receiver(_ref) {
    var url = _ref.url,
        application = _ref.application,
        prefetch = _ref.prefetch;
    (0, _classCallCheck2.default)(this, Receiver);

    if (!url) {
      throw new Error('Url is missing.');
    }

    if (!application) {
      throw new Error('Application is missing.');
    }

    this.url = url;
    this.application = application;
    this.prefetch = prefetch;
  }

  (0, _createClass2.default)(Receiver, [{
    key: "link",
    value: function () {
      var _link = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(app, incoming, outgoing) {
        var _this = this;

        var logger, mq, readStream;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (app) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('App is missing.');

              case 2:
                if (incoming) {
                  _context2.next = 4;
                  break;
                }

                throw new Error('Incoming is missing.');

              case 4:
                if (outgoing) {
                  _context2.next = 6;
                  break;
                }

                throw new Error('Outgoing is missing.');

              case 6:
                logger = app.services.getLogger();
                _context2.prev = 7;
                _context2.next = 10;
                return retry(
                /*#__PURE__*/
                (0, _asyncToGenerator2.default)(
                /*#__PURE__*/
                _regenerator.default.mark(function _callee() {
                  var url, prefetch, connection;
                  return _regenerator.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          url = _this.url, prefetch = _this.prefetch;
                          _context.next = 3;
                          return hase.connect({
                            url: url,
                            prefetch: prefetch
                          });

                        case 3:
                          connection = _context.sent;
                          return _context.abrupt("return", connection);

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                })));

              case 10:
                mq = _context2.sent;
                _context2.next = 16;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](7);
                return _context2.abrupt("return", incoming.emit('error', _context2.t0));

              case 16:
                mq.on('error', function (errMq) {
                  incoming.emit('error', errMq);
                });
                mq.on('disconnect', function () {
                  incoming.emit('disconnect');
                });
                _context2.prev = 18;
                _context2.next = 21;
                return mq.worker("".concat(this.application, "::flows")).createReadStream();

              case 21:
                readStream = _context2.sent;
                _context2.next = 27;
                break;

              case 24:
                _context2.prev = 24;
                _context2.t1 = _context2["catch"](18);
                return _context2.abrupt("return", incoming.emit('error', _context2.t1));

              case 27:
                logger.debug('Started flowbus (receiver) endpoint.', {
                  url: this.url,
                  application: this.application
                });
                readStream.on('data', function (message) {
                  var event;

                  try {
                    event = app.Event.wrap(message.payload);
                  } catch (ex) {
                    logger.warn('Discarding event...', event);
                    return message.discard();
                  }

                  event.next = message.next;
                  event.discard = message.discard;
                  event.defer = message.defer;
                  incoming.write(event);
                });

              case 29:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 13], [18, 24]]);
      }));

      function link(_x, _x2, _x3) {
        return _link.apply(this, arguments);
      }

      return link;
    }()
  }]);
  return Receiver;
}();

module.exports = Receiver;