'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var WebSocket = require('ws');

var sendMessage =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(socket, _ref) {
    var type, procedureId, payload, _ref$statusCode, statusCode, message;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = _ref.type, procedureId = _ref.procedureId, payload = _ref.payload, _ref$statusCode = _ref.statusCode, statusCode = _ref$statusCode === void 0 ? 200 : _ref$statusCode;

            if (socket) {
              _context.next = 3;
              break;
            }

            throw new Error('Socket is missing.');

          case 3:
            if (type) {
              _context.next = 5;
              break;
            }

            throw new Error('Type is missing.');

          case 5:
            message = {
              type: type,
              payload: payload,
              statusCode: statusCode
            };

            if (procedureId) {
              message.procedureId = procedureId;
            }

            if (!(socket.readyState !== WebSocket.OPEN)) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return");

          case 9:
            _context.next = 11;
            return new Promise(function (resolve, reject) {
              socket.send(JSON.stringify(message), function (err) {
                if (err) {
                  return reject(err);
                }

                resolve();
              });
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendMessage(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = sendMessage;