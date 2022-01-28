'use strict';

const partOf = function (subset, superset) {
  if (typeof subset !== 'object') {
    return false;
  }
  if (typeof superset !== 'object') {
    return false;
  }
  if (Boolean(subset) && !superset) {
    return false;
  }

  return Object.keys(subset).every(key => {
    const subsetValue = subset[key],
          supersetValue = superset[key];

    if (typeof supersetValue === 'object' && supersetValue !== null && subsetValue !== null) {
      return partOf(subsetValue, supersetValue);
    }

    return subsetValue === supersetValue;
  });
};

module.exports = partOf;
