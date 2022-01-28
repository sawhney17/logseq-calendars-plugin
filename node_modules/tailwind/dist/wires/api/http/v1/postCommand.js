'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Command = require('commands-events').Command,
    typer = require('content-type');

var validateCommand = require('./validateCommand');

var postCommand = function postCommand(app, _ref) {
  var writeModel = _ref.writeModel;
  return function (req, res) {
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var command, contentType;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              command = req.body;
              _context.prev = 1;
              contentType = typer.parse(req);
              _context.next = 8;
              break;

            case 5:
              _context.prev = 5;
              _context.t0 = _context["catch"](1);
              return _context.abrupt("return", res.status(415).send('Header content-type must be application/json.'));

            case 8:
              if (!(contentType.type !== 'application/json')) {
                _context.next = 10;
                break;
              }

              return _context.abrupt("return", res.status(415).send('Header content-type must be application/json.'));

            case 10:
              _context.prev = 10;
              validateCommand(command, writeModel);
              _context.next = 17;
              break;

            case 14:
              _context.prev = 14;
              _context.t1 = _context["catch"](10);
              return _context.abrupt("return", res.status(400).send(_context.t1.message));

            case 17:
              command = Command.wrap(command);
              command.addToken(req.user);
              app.api.incoming.write(command);
              res.status(200).end();

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 5], [10, 14]]);
    }))();
  };
};

module.exports = postCommand;