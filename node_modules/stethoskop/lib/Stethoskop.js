'use strict';

const os = require('os');

const StatsD = require('node-statsd');

const fakeStethoskop = {
  noteValue () {}
};

let lastCpuCheck,
    lastCpuUsage;

const resetCpuCheck = function () {
  lastCpuCheck = process.hrtime();
  lastCpuUsage = process.cpuUsage();
};

const getMicroseconds = function (hrTime) {
  return hrTime[0] * 1e9 + hrTime[1];
};

class Stethoskop {
  constructor (options) {
    const { enabled, from, to } = options;
    const {
      host = 'localhost',
      port = 8125
    } = to;

    if (!enabled) {
      return fakeStethoskop;
    }

    this.statsD = new StatsD({
      host,
      port,
      prefix: `${from.application}.${os.hostname()}.`
    });

    resetCpuCheck();

    this.watchSystemUsage(60);
  }

  watchSystemUsage (seconds) {
    setInterval(() => {
      this.noteCpuUsage();
      this.noteMemoryUsage();
    }, seconds * 1000);
  }

  noteCpuUsage () {
    const averageLoad = os.loadavg()[0],
          cpuUsage = process.cpuUsage(lastCpuUsage),
          interval = getMicroseconds(process.hrtime(lastCpuCheck)) / 1000;

    resetCpuCheck();

    this.noteValue('$cpu.load.average', averageLoad / os.cpus().length);
    this.noteValue('$cpu.usage.system', cpuUsage.system / interval);
    this.noteValue('$cpu.usage.user', cpuUsage.user / interval);
  }

  noteMemoryUsage () {
    const memoryUsage = process.memoryUsage();

    this.noteValue('$memory.rss', memoryUsage.rss);
    this.noteValue('$memory.heap.used', memoryUsage.heapUsed);
    this.noteValue('$memory.heap.total', memoryUsage.heapTotal);
  }

  noteValue (key, value) {
    this.statsD.gauge(key, value);
  }
}

module.exports = Stethoskop;
