'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _require = require('stream'),
    Writable = _require.Writable;

var stackTrace = require('stack-trace');

var Middleware =
/*#__PURE__*/
function (_Writable) {
  (0, _inherits2.default)(Middleware, _Writable);

  function Middleware(level, source) {
    var _this;

    (0, _classCallCheck2.default)(this, Middleware);

    if (!level) {
      throw new Error('Level is missing.');
    }
    /* eslint-disable global-require */


    var flaschenpost = require('../flaschenpost');
    /* eslint-enable global-require */


    var options = {};
    options.objectMode = true;
    options.source = source || stackTrace.get()[1].getFileName();
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Middleware).call(this, options));
    _this.level = level;
    _this.logger = flaschenpost.getLogger(options.source);

    if (!_this.logger[_this.level]) {
      throw new Error('Level is invalid.');
    }

    return _this;
  }

  (0, _createClass2.default)(Middleware, [{
    key: "_write",
    value: function _write(chunk, encoding, callback) {
      this.logger[this.level](chunk);
      callback();
    }
  }]);
  return Middleware;
}(Writable);

module.exports = Middleware;