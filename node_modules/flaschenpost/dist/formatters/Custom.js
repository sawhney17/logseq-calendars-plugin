'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _require = require('stream'),
    Transform = _require.Transform;

var untildify = require('untildify');

var format;

var Custom =
/*#__PURE__*/
function (_Transform) {
  (0, _inherits2.default)(Custom, _Transform);

  function Custom(options) {
    (0, _classCallCheck2.default)(this, Custom);

    if (!options) {
      throw new Error('Options are missing.');
    }

    if (!options.js) {
      throw new Error('JavaScript is missing.');
    }
    /* eslint-disable global-require */


    format = require(untildify(options.js));
    /* eslint-enable global-require */

    options.objectMode = true;
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Custom).call(this, options));
  }

  (0, _createClass2.default)(Custom, [{
    key: "_transform",
    value: function _transform(chunk, encoding, callback) {
      var result = format(chunk);
      this.push(result);
      callback();
    }
  }]);
  return Custom;
}(Transform);

module.exports = Custom;