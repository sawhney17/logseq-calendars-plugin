'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var alias = {
  eq: 'equal',
  ne: 'notEqual',
  gt: 'greaterThan',
  ge: 'greaterThanOrEqual',
  lt: 'lessThan',
  le: 'lessThanOrEqual',
  id: 'identical',

  eqs: 'equalByStructure',
  nes: 'notEqualByStructure',
  gts: 'greaterThanByStructure',
  ges: 'greaterThanOrEqualByStructure',
  lts: 'lessThanByStructure',
  les: 'lessThanOrEqualByStructure'
};

var isSubset = function isSubset(derived, base, verified) {
  if (!verified) {
    verified = [];
  }

  for (var i in derived) {
    if (verified.indexOf(derived[i]) === -1) {
      if (_typeof(derived[i]) === 'object') {
        verified.push(derived[i]);
      }

      if (!base.hasOwnProperty(i)) {
        return false;
      }

      /* eslint-disable no-use-before-define */
      if (_typeof(derived[i]) === 'object' && _typeof(base[i]) === 'object' && derived[i] && base[i]) {
        if (Array.isArray(derived[i]) && !Array.isArray(base[i]) || !Array.isArray(derived[i]) && Array.isArray(base[i])) {
          return false;
        }
        if (!(isSubset(derived[i], base[i], verified) && isSubset(base[i], derived[i], verified))) {
          return false;
        }
      } else if (cmp.ne(derived[i], base[i])) {
        return false;
      }
      /* eslint-enable no-use-before-define */
    }
  }

  return true;
};

var isSubsetStructure = function isSubsetStructure(derived, base, verified) {
  if (!verified) {
    verified = [];
  }

  for (var i in derived) {
    if (verified.indexOf(derived[i]) === -1) {
      if (_typeof(derived[i]) === 'object') {
        verified.push(derived[i]);
      }
      if (_typeof(base[i]) !== _typeof(derived[i]) || _typeof(derived[i]) === 'object' && !isSubsetStructure(derived[i], base[i], verified)) {
        return false;
      }
    }
  }

  return true;
};

var wrap = function wrap(fn1, fn2) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return Reflect.apply(fn2, this, [fn1].concat(args));
  };
};

var unwrap = function unwrap(obj) {
  if (obj === null) {
    return obj;
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && (obj.constructor === Number || obj.constructor === String || obj.constructor === Boolean)) {
    return obj.valueOf();
  }

  return obj;
};

var processTypes = function processTypes(fn, first, second) {
  first = unwrap(first);
  second = unwrap(second);

  return fn(first, second);
};

var processTypesStructure = function processTypesStructure(fn, first, second) {
  if ((typeof first === 'undefined' ? 'undefined' : _typeof(first)) !== 'object' || (typeof second === 'undefined' ? 'undefined' : _typeof(second)) !== 'object') {
    return false;
  }

  if (first && second && (first.constructor === Array || second.constructor === Array)) {
    return false;
  }

  return fn(first, second);
};

var cmp = {
  eq: function eq(first, second) {
    // If two functions shall be compared, compare their source code.
    if (typeof first === 'function' && typeof second === 'function') {
      first = first.toString();
      second = second.toString();
    }

    // Objects are compared as subsets, but only if both are defined (i.e. not null, undefined, ...).
    if ((typeof first === 'undefined' ? 'undefined' : _typeof(first)) === 'object' && (typeof second === 'undefined' ? 'undefined' : _typeof(second)) === 'object' && first && second) {
      if (Array.isArray(first) && !Array.isArray(second) || !Array.isArray(first) && Array.isArray(second)) {
        return false;
      }

      return isSubset(first, second) && isSubset(second, first);
    }

    return first === second;
  },
  eqs: function eqs(first, second) {
    // If exactly one is null, they are not equal by structure.
    if (first && !second || !first && second) {
      return false;
    }

    // If both are null, they are equal by structure.
    if (!first && !second) {
      return true;
    }

    return isSubsetStructure(first, second) && isSubsetStructure(second, first);
  },
  ne: function ne(first, second) {
    return !this.eq(first, second);
  },
  nes: function nes(first, second) {
    return !this.eqs(first, second);
  },
  gt: function gt(first, second) {
    // If at least one parameter is a function, greater than does not make sense.
    if (typeof first === 'function' || typeof second === 'function') {
      return false;
    }

    // Objects are compared as subsets, but only if both are defined (i.e. not null, undefined, ...).
    if ((typeof first === 'undefined' ? 'undefined' : _typeof(first)) === 'object' && (typeof second === 'undefined' ? 'undefined' : _typeof(second)) === 'object' && first && second) {
      return isSubset(second, first) && !isSubset(first, second);
    }

    // If an object is compared with null, neither is greater.
    if ((typeof first === 'undefined' ? 'undefined' : _typeof(first)) === 'object' && !second || (typeof second === 'undefined' ? 'undefined' : _typeof(second)) === 'object' && !first) {
      return false;
    }

    return first > second;
  },
  gts: function gts(first, second) {
    // If the second object is null, the first is greater by structure.
    if (first && !second) {
      return true;
    }

    // Otherwise, if the first is null, it is not greater (no matter what the second is).
    if (!first) {
      return false;
    }

    // If both are not null, compare as a subset. Note that second must be a subset of first, if first
    // is greater than second.
    return isSubsetStructure(second, first) && !isSubsetStructure(first, second);
  },
  ge: function ge(first, second) {
    return this.gt(first, second) || this.eq(first, second);
  },
  ges: function ges(first, second) {
    return this.gts(first, second) || this.eqs(first, second);
  },
  lt: function lt(first, second) {
    // If at least one parameter is a function, less than does not make sense.
    if (typeof first === 'function' || typeof second === 'function') {
      return false;
    }

    // Objects are compared as subsets, but only if both are defined (i.e. not null, undefined, ...).
    if ((typeof first === 'undefined' ? 'undefined' : _typeof(first)) === 'object' && (typeof second === 'undefined' ? 'undefined' : _typeof(second)) === 'object' && first && second) {
      return isSubset(first, second) && !isSubset(second, first);
    }

    // If an object is compared with null, neither is greater.
    if ((typeof first === 'undefined' ? 'undefined' : _typeof(first)) === 'object' && !second || (typeof second === 'undefined' ? 'undefined' : _typeof(second)) === 'object' && !first) {
      return false;
    }

    return first < second;
  },
  lts: function lts(first, second) {
    // If the first object is null, it is less by structure.
    if (!first && second) {
      return true;
    }

    // Otherwise, if the second is null, the first is not less (no matter what it is).
    if (!second) {
      return false;
    }

    // If both are not null, compare as a subset. Note that first must be a subset of second, if first
    // is less than second.
    return isSubsetStructure(first, second) && !isSubsetStructure(second, first);
  },
  le: function le(first, second) {
    return this.lt(first, second) || this.eq(first, second);
  },
  les: function les(first, second) {
    return this.lts(first, second) || this.eqs(first, second);
  },
  id: function id(first, second) {
    // Functions and objects need to be compared by reference, all other types are compared by value.
    if (typeof first === 'function' && typeof second === 'function' || (typeof first === 'undefined' ? 'undefined' : _typeof(first)) === 'object' && (typeof second === 'undefined' ? 'undefined' : _typeof(second)) === 'object') {
      return first === second;
    }

    return this.eq(first, second);
  }
};

var setupFunction = function setupFunction(comparer, fn) {
  return wrap(comparer.bind(cmp), fn);
};

for (var j in cmp) {
  if (cmp.hasOwnProperty(j)) {
    if (j.length === 3) {
      module.exports[j] = module.exports[alias[j]] = setupFunction(cmp[j], processTypesStructure);
    } else {
      module.exports[j] = module.exports[alias[j]] = setupFunction(cmp[j], processTypes);
    }
  }
}