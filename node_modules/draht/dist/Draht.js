'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('eventemitter2'),
    EventEmitter2 = _require.EventEmitter2;

var Draht = function (_EventEmitter) {
  _inherits(Draht, _EventEmitter);

  function Draht() {
    _classCallCheck(this, Draht);

    return _possibleConstructorReturn(this, (Draht.__proto__ || Object.getPrototypeOf(Draht)).call(this, {
      delimiter: '::',
      wildcard: true
    }));
  }

  _createClass(Draht, [{
    key: 'emit',
    value: function emit() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      process.nextTick(function () {
        var _get2;

        return (_get2 = _get(Draht.prototype.__proto__ || Object.getPrototypeOf(Draht.prototype), 'emit', _this2)).call.apply(_get2, [_this2].concat(args));
      });
    }
  }]);

  return Draht;
}(EventEmitter2);

Draht.instance = new Draht();

module.exports = Draht;