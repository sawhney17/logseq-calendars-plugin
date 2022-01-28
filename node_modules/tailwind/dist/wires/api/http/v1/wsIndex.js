'use strict';

var handleMessage = require('./wsHandleMessage'),
    postEvents = require('./wsPostEvents'),
    postRead = require('./wsPostRead'),
    sendMessage = require('./wsSendMessage');

module.exports = {
  handleMessage: handleMessage,
  postEvents: postEvents,
  postRead: postRead,
  sendMessage: sendMessage
};