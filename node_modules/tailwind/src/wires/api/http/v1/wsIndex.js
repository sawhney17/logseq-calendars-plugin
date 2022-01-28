'use strict';

const handleMessage = require('./wsHandleMessage'),
      postEvents = require('./wsPostEvents'),
      postRead = require('./wsPostRead'),
      sendMessage = require('./wsSendMessage');

module.exports = { handleMessage, postEvents, postRead, sendMessage };
