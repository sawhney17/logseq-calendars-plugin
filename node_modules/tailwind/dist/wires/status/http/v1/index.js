'use strict';

var express = require('express');

var getStatus = require('./getStatus');

var v1 = function v1() {
  var api = express();
  api.get('/status', getStatus());
  return api;
};

module.exports = v1;