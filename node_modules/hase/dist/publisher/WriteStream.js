'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _require = require('stream'),
    Writable = _require.Writable;

var WriteStream =
/*#__PURE__*/
function (_Writable) {
  (0, _inherits2.default)(WriteStream, _Writable);

  function WriteStream(channel, name) {
    var _this;

    (0, _classCallCheck2.default)(this, WriteStream);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WriteStream).call(this, {
      objectMode: true
    }));
    _this.channel = channel;
    _this.name = name;
    return _this;
  }

  (0, _createClass2.default)(WriteStream, [{
    key: "_write",
    value: function _write(chunk, encoding, callback) {
      this.channel.publish(this.name, '', Buffer.from(JSON.stringify(chunk), 'utf8'), {
        persistent: true
      });
      callback(null);
    }
  }]);
  return WriteStream;
}(Writable);

module.exports = WriteStream;