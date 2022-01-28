'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _require = require('stream'),
    Transform = _require.Transform;

var Json =
/*#__PURE__*/
function (_Transform) {
  (0, _inherits2.default)(Json, _Transform);

  function Json(options) {
    (0, _classCallCheck2.default)(this, Json);
    options = options || {};
    options.objectMode = true;
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Json).call(this, options));
  }

  (0, _createClass2.default)(Json, [{
    key: "_transform",
    value: function _transform(chunk, encoding, callback) {
      this.push("".concat(JSON.stringify(chunk), "\n"));
      callback();
    }
  }]);
  return Json;
}(Transform);

module.exports = Json;