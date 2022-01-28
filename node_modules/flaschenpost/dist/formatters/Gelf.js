'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _require = require('stream'),
    Transform = _require.Transform;

var Gelf =
/*#__PURE__*/
function (_Transform) {
  (0, _inherits2.default)(Gelf, _Transform);

  function Gelf(options) {
    var _this;

    (0, _classCallCheck2.default)(this, Gelf);
    options = options || {};
    options.objectMode = true;
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Gelf).call(this, options));
    _this.predefinedKeys = ['version', 'host', 'short_message', 'full_message', 'timestamp', 'level', 'facility', 'line', 'file'];
    _this.mappedKeys = {
      message: 'short_message'
    };
    _this.defaultValues = {
      version: '1.1'
    };
    return _this;
  }

  (0, _createClass2.default)(Gelf, [{
    key: "_transform",
    value: function _transform(chunk, encoding, callback) {
      var _this2 = this;

      var result = Object.assign({}, this.defaultValues);
      Object.keys(chunk).forEach(function (key) {
        var mappedKey;

        if (_this2.predefinedKeys.includes(key)) {
          mappedKey = key;
        } else if (_this2.mappedKeys[key]) {
          mappedKey = _this2.mappedKeys[key];
        } else {
          mappedKey = "_".concat(key);
        }

        result[mappedKey] = chunk[key];
      });
      this.push(JSON.stringify(result));
      callback();
    }
  }]);
  return Gelf;
}(Transform);

module.exports = Gelf;