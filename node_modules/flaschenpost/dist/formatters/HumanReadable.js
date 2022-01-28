'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _require = require('stream'),
    Transform = _require.Transform;

var moment = require('moment'),
    stringifyObject = require('stringify-object');

var colorize = require('./colorize');

var HumanReadable =
/*#__PURE__*/
function (_Transform) {
  (0, _inherits2.default)(HumanReadable, _Transform);

  function HumanReadable(options) {
    (0, _classCallCheck2.default)(this, HumanReadable);
    options = options || {};
    options.objectMode = true;
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(HumanReadable).call(this, options));
  }

  (0, _createClass2.default)(HumanReadable, [{
    key: "_transform",
    value: function _transform(chunk, encoding, callback) {
      var timestamp = moment.utc(chunk.timestamp);
      var origin = '',
          result = '';
      origin = "".concat(chunk.host);

      if (chunk.application) {
        // Be backward compatible and allow to parse logs without application data
        origin += "::".concat(chunk.application.name, "@").concat(chunk.application.version);
      }

      if (!chunk.application || chunk.application.name !== chunk.module.name) {
        // Do not print the same module information twice
        origin += "::".concat(chunk.module.name, "@").concat(chunk.module.version);
      }

      if (chunk.source) {
        origin += " (".concat(chunk.source, ")");
      }

      result += colorize("".concat(chunk.message, " (").concat(chunk.level, ")"), chunk.level, 'bold');
      result += '\n';
      result += colorize(origin, 'white');
      result += '\n';
      result += colorize("".concat(timestamp.format('HH:mm:ss.SSS'), "@").concat(timestamp.format('YYYY-MM-DD'), " ").concat(chunk.pid, "#").concat(chunk.id), 'gray');
      result += '\n';

      if (chunk.metadata) {
        result += colorize(stringifyObject(chunk.metadata, {
          indent: '  ',
          singleQuotes: true
        }).replace(/\\n/g, '\n'), 'gray');
        result += '\n';
      }

      result += colorize("\u2500".repeat(process.stdout.columns || 80), 'gray');
      result += '\n';
      this.push(result);
      callback();
    }
  }]);
  return HumanReadable;
}(Transform);

module.exports = HumanReadable;