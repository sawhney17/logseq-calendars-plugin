'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var os = require('os');

var StatsD = require('node-statsd');

var fakeStethoskop = {
  noteValue: function noteValue() {}
};

var lastCpuCheck = void 0,
    lastCpuUsage = void 0;

var resetCpuCheck = function resetCpuCheck() {
  lastCpuCheck = process.hrtime();
  lastCpuUsage = process.cpuUsage();
};

var getMicroseconds = function getMicroseconds(hrTime) {
  return hrTime[0] * 1e9 + hrTime[1];
};

var Stethoskop = function () {
  function Stethoskop(options) {
    _classCallCheck(this, Stethoskop);

    var enabled = options.enabled,
        from = options.from,
        to = options.to;
    var _to$host = to.host,
        host = _to$host === undefined ? 'localhost' : _to$host,
        _to$port = to.port,
        port = _to$port === undefined ? 8125 : _to$port;


    if (!enabled) {
      return fakeStethoskop;
    }

    this.statsD = new StatsD({
      host: host,
      port: port,
      prefix: from.application + '.' + os.hostname() + '.'
    });

    resetCpuCheck();

    this.watchSystemUsage(60);
  }

  _createClass(Stethoskop, [{
    key: 'watchSystemUsage',
    value: function watchSystemUsage(seconds) {
      var _this = this;

      setInterval(function () {
        _this.noteCpuUsage();
        _this.noteMemoryUsage();
      }, seconds * 1000);
    }
  }, {
    key: 'noteCpuUsage',
    value: function noteCpuUsage() {
      var averageLoad = os.loadavg()[0],
          cpuUsage = process.cpuUsage(lastCpuUsage),
          interval = getMicroseconds(process.hrtime(lastCpuCheck)) / 1000;

      resetCpuCheck();

      this.noteValue('$cpu.load.average', averageLoad / os.cpus().length);
      this.noteValue('$cpu.usage.system', cpuUsage.system / interval);
      this.noteValue('$cpu.usage.user', cpuUsage.user / interval);
    }
  }, {
    key: 'noteMemoryUsage',
    value: function noteMemoryUsage() {
      var memoryUsage = process.memoryUsage();

      this.noteValue('$memory.rss', memoryUsage.rss);
      this.noteValue('$memory.heap.used', memoryUsage.heapUsed);
      this.noteValue('$memory.heap.total', memoryUsage.heapTotal);
    }
  }, {
    key: 'noteValue',
    value: function noteValue(key, value) {
      this.statsD.gauge(key, value);
    }
  }]);

  return Stethoskop;
}();

module.exports = Stethoskop;