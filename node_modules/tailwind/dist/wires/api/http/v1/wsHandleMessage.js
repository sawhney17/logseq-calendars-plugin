'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var postCommand = require('./wsPostCommand'),
    postEvents = require('./wsPostEvents'),
    postRead = require('./wsPostRead'),
    sendMessage = require('./wsSendMessage');

var handleMessage =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(socket, _ref) {
    var app, message, readModel, writeModel, logger;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app = _ref.app, message = _ref.message, readModel = _ref.readModel, writeModel = _ref.writeModel;

            if (socket) {
              _context.next = 3;
              break;
            }

            throw new Error('Socket is missing.');

          case 3:
            if (app) {
              _context.next = 5;
              break;
            }

            throw new Error('App is missing.');

          case 5:
            if (message) {
              _context.next = 7;
              break;
            }

            throw new Error('Message is missing.');

          case 7:
            if (readModel) {
              _context.next = 9;
              break;
            }

            throw new Error('Read model is missing.');

          case 9:
            if (writeModel) {
              _context.next = 11;
              break;
            }

            throw new Error('Write model is missing.');

          case 11:
            logger = app.services.getLogger();
            _context.t0 = message.type;
            _context.next = _context.t0 === 'sendCommand' ? 15 : _context.t0 === 'subscribeEvents' ? 18 : _context.t0 === 'unsubscribeEvents' ? 21 : _context.t0 === 'subscribeRead' ? 24 : _context.t0 === 'unsubscribeRead' ? 27 : 30;
            break;

          case 15:
            _context.next = 17;
            return postCommand.send(socket, {
              app: app,
              message: message,
              writeModel: writeModel
            });

          case 17:
            return _context.abrupt("break", 38);

          case 18:
            _context.next = 20;
            return postEvents.subscribe(socket, {
              app: app,
              message: message
            });

          case 20:
            return _context.abrupt("break", 38);

          case 21:
            _context.next = 23;
            return postEvents.unsubscribe(socket, {
              app: app,
              message: message
            });

          case 23:
            return _context.abrupt("break", 38);

          case 24:
            _context.next = 26;
            return postRead.subscribe(socket, {
              app: app,
              message: message,
              readModel: readModel
            });

          case 26:
            return _context.abrupt("break", 38);

          case 27:
            _context.next = 29;
            return postRead.unsubscribe(socket, {
              app: app,
              message: message
            });

          case 29:
            return _context.abrupt("break", 38);

          case 30:
            _context.prev = 30;
            _context.next = 33;
            return sendMessage(socket, {
              type: 'error',
              statusCode: 400,
              payload: 'Bad request.'
            });

          case 33:
            _context.next = 38;
            break;

          case 35:
            _context.prev = 35;
            _context.t1 = _context["catch"](30);
            logger.error('Failed to send message.', {
              ex: _context.t1
            });

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[30, 35]]);
  }));

  return function handleMessage(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = handleMessage;