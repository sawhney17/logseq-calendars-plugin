'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var getRandom = require('./getRandom');

var Timer = function (_EventEmitter) {
  _inherits(Timer, _EventEmitter);

  function Timer(timeout) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Timer);

    if (timeout === undefined) {
      throw new Error('Timeout is missing.');
    }

    var _this = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this));

    var immediate = options.immediate,
        variation = options.variation;


    _this.timeout = timeout;
    _this.timer = undefined;

    _this.isRunning = false;

    _this.immediate = Boolean(immediate);
    _this.variation = variation || 0;

    if (_this.immediate) {
      _this.tick();
    }

    _this.start();
    return _this;
  }

  _createClass(Timer, [{
    key: 'tick',
    value: function tick() {
      var _this2 = this;

      var timeout = this.timeout + getRandom(0 - this.variation, this.variation);

      process.nextTick(function () {
        _this2.emit('tick');
      });

      this.timer = setTimeout(function () {
        _this2.tick();
      }, timeout);
    }
  }, {
    key: 'start',
    value: function start() {
      var _this3 = this;

      if (this.isRunning) {
        return;
      }

      this.isRunning = true;
      this.timer = setTimeout(function () {
        _this3.tick();
      }, this.timeout);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.isRunning = false;
      clearTimeout(this.timer);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.stop();
      this.removeAllListeners();
    }
  }]);

  return Timer;
}(EventEmitter);

module.exports = Timer;