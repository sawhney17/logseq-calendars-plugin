'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var partOf = function partOf(subset, superset) {
  if ((typeof subset === 'undefined' ? 'undefined' : _typeof(subset)) !== 'object') {
    return false;
  }
  if ((typeof superset === 'undefined' ? 'undefined' : _typeof(superset)) !== 'object') {
    return false;
  }
  if (Boolean(subset) && !superset) {
    return false;
  }

  return Object.keys(subset).every(function (key) {
    var subsetValue = subset[key],
        supersetValue = superset[key];

    if ((typeof supersetValue === 'undefined' ? 'undefined' : _typeof(supersetValue)) === 'object' && supersetValue !== null && subsetValue !== null) {
      return partOf(subsetValue, supersetValue);
    }

    return subsetValue === supersetValue;
  });
};

module.exports = partOf;