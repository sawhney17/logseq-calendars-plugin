'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _require = require('stream'),
    PassThrough = _require.PassThrough;

var IoPort =
/*#__PURE__*/
function () {
  function IoPort(app) {
    (0, _classCallCheck2.default)(this, IoPort);

    if (!app) {
      throw new Error('App is missing.');
    }

    this.app = app;
    this.incoming = new PassThrough({
      objectMode: true
    });
    this.outgoing = new PassThrough({
      objectMode: true
    });
  }

  (0, _createClass2.default)(IoPort, [{
    key: "use",
    value: function () {
      var _use = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(wire) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (wire) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Wire is missing.');

              case 2:
                _context.next = 4;
                return wire.link(this.app, this.incoming, this.outgoing);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function use(_x) {
        return _use.apply(this, arguments);
      }

      return use;
    }()
  }]);
  return IoPort;
}();

module.exports = IoPort;