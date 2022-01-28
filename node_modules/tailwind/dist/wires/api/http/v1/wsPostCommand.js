'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Command = require('commands-events').Command;

var sendMessage = require('./wsSendMessage'),
    validateCommand = require('./validateCommand');

var postCommand = {
  send: function () {
    var _send = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(socket, _ref) {
      var app, message, writeModel, logger, command, token;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              app = _ref.app, message = _ref.message, writeModel = _ref.writeModel;

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
              if (writeModel) {
                _context.next = 9;
                break;
              }

              throw new Error('Write model is missing.');

            case 9:
              logger = app.services.getLogger();
              command = message.payload;
              token = message.token;
              _context.prev = 12;
              validateCommand(command, writeModel);
              _context.next = 27;
              break;

            case 16:
              _context.prev = 16;
              _context.t0 = _context["catch"](12);
              _context.prev = 18;
              _context.next = 21;
              return sendMessage(socket, {
                type: 'error',
                statusCode: 400,
                payload: _context.t0.message,
                procedureId: message.procedureId
              });

            case 21:
              _context.next = 26;
              break;

            case 23:
              _context.prev = 23;
              _context.t1 = _context["catch"](18);
              logger.error('Failed to send message.', {
                ex: _context.t0
              });

            case 26:
              return _context.abrupt("return");

            case 27:
              command = Command.wrap(command);
              command.addToken(token);
              app.api.incoming.write(command);
              _context.prev = 30;
              _context.next = 33;
              return sendMessage(socket, {
                type: 'sentCommand',
                statusCode: 200,
                procedureId: message.procedureId
              });

            case 33:
              _context.next = 38;
              break;

            case 35:
              _context.prev = 35;
              _context.t2 = _context["catch"](30);
              logger.error('Failed to send message.', {
                exSendMessage: _context.t2
              });

            case 38:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[12, 16], [18, 23], [30, 35]]);
    }));

    function send(_x, _x2) {
      return _send.apply(this, arguments);
    }

    return send;
  }()
};
module.exports = postCommand;