'use strict';

const format = function (log) {
  return `${log.level}  ${log.message}`;
};

module.exports = format;
