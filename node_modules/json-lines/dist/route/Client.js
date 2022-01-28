'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var Client = function (_EventEmitter) {
  _inherits(Client, _EventEmitter);

  function Client(req, res) {
    _classCallCheck(this, Client);

    var _this = _possibleConstructorReturn(this, (Client.__proto__ || Object.getPrototypeOf(Client)).call(this));

    _this.req = req;
    _this.res = res;
    return _this;
  }

  _createClass(Client, [{
    key: 'send',
    value: function send(data) {
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
        throw new Error('Data must be an object.');
      }
      if (data === null) {
        throw new Error('Data must not be null.');
      }

      try {
        this.res.write(JSON.stringify(data) + '\n');
      } catch (ex) {
        if (ex.message === 'write after end') {
          // Ignore write after end errors. This simply means that the connection
          // was closed concurrently, and we can't do anything about it anyway.
          // Hence, simply return.
          return;
        }
        throw ex;
      }
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.res.end();
      this.res.removeAllListeners();
    }
  }]);

  return Client;
}(EventEmitter);

module.exports = Client;