'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cloneDeep = require('lodash/cloneDeep'),
    compare = require('comparejs'),
    defaults = require('lodash/defaults'),
    _require = require('eventemitter2'),
    EventEmitter2 = _require.EventEmitter2;

var Datasette = function (_EventEmitter) {
  _inherits(Datasette, _EventEmitter);

  function Datasette() {
    _classCallCheck(this, Datasette);

    var _this = _possibleConstructorReturn(this, (Datasette.__proto__ || Object.getPrototypeOf(Datasette)).call(this));

    _this.data = {};
    return _this;
  }

  _createClass(Datasette, [{
    key: 'get',
    value: function get(key) {
      return cloneDeep(this.data[key]);
    }
  }, {
    key: 'set',
    value: function set(key, value, options) {
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
        if (value) {
          options = value;
          value = undefined;
        }

        for (var i in key) {
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
        this.emit('changed::' + key, cloneDeep(value));
      }
    }
  }]);

  return Datasette;
}(EventEmitter2);

module.exports = Datasette;