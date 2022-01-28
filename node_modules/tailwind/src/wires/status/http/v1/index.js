'use strict';

const express = require('express');

const getStatus = require('./getStatus');

const v1 = function () {
  const api = express();

  api.get('/status', getStatus());

  return api;
};

module.exports = v1;
