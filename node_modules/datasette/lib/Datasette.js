'use strict';

const cloneDeep = require('lodash/cloneDeep'),
      compare = require('comparejs'),
      defaults = require('lodash/defaults'),
      { EventEmitter2 } = require('eventemitter2');

class Datasette extends EventEmitter2 {
  constructor () {
    super();

    this.data = {};
  }

  get (key) {
    return cloneDeep(this.data[key]);
  }

  set (key, value, options) {
    if (typeof key === 'object') {
      if (value) {
        options = value;
        value = undefined;
      }

      for (const i in key) {
        if (key.hasOwnProperty(i)) {
          this.set(i, key[i], options);
        }
      }

      return;
    }

    options = defaults({}, options, {
      silent: false
    });

    if (compare.equal(this.data[key], value)) {
      return;
    }

    this.data[key] = cloneDeep(value);

    if (!options.silent) {
      this.emit('changed', key, cloneDeep(value));
      this.emit(`changed::${key}`, cloneDeep(value));
    }
  }
}

module.exports = Datasette;
