'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var Publisher = require('./publisher'),
    Worker = require('./worker');

var Mq =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(Mq, _EventEmitter);

  function Mq(connection, channel) {
    var _this;

    (0, _classCallCheck2.default)(this, Mq);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Mq).call(this));
    _this.connection = connection;
    _this.channel = channel;
    var onClose, onError;

    var unsubscribe = function unsubscribe() {
      _this.connection.removeListener('close', onClose);

      _this.connection.removeListener('error', onError);

      _this.channel.removeListener('close', onClose);

      _this.channel.removeListener('error', onError);
    };

    onClose = function onClose() {
      unsubscribe();

      _this.emit('disconnect');
    };

    onError = function onError() {
      unsubscribe();

      _this.emit('disconnect');
    };

    _this.connection.on('close', onClose);

    _this.connection.on('error', onError);

    _this.channel.on('close', onClose);

    _this.channel.on('error', onError);

    return _this;
  }

  (0, _createClass2.default)(Mq, [{
    key: "worker",
    value: function worker(name) {
      if (!name) {
        throw new Error('Name is missing.');
      }

      return new Worker(this.channel, name);
    }
  }, {
    key: "publisher",
    value: function publisher(name) {
      if (!name) {
        throw new Error('Name is missing.');
      }

      return new Publisher(this.channel, name);
    }
  }]);
  return Mq;
}(EventEmitter);

module.exports = Mq;