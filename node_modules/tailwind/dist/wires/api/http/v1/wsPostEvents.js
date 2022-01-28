'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var partOf = require('partof');

var sendMessage = require('./wsSendMessage');

var subscriptions = {};
var postEvents = {
  subscribe: function () {
    var _subscribe = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2(socket, _ref) {
      var app, message, logger, filter, sendToClient, unsubscribe;
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              app = _ref.app, message = _ref.message;

              if (socket) {
                _context2.next = 3;
                break;
              }

              throw new Error('Socket is missing.');

            case 3:
              if (app) {
                _context2.next = 5;
                break;
              }

              throw new Error('App is missing.');

            case 5:
              if (message) {
                _context2.next = 7;
                break;
              }

              throw new Error('Message is missing.');

            case 7:
              logger = app.services.getLogger();
              filter = message.payload ? message.payload.filter || {} : {};

              sendToClient = function sendToClient(event) {
                if (!partOf(filter, event)) {
                  return;
                }

                if (!event.metadata.isAuthorized || event.metadata.isAuthorized.forPublic || event.metadata.isAuthorized.forAuthenticated && message.token.sub !== 'anonymous' || event.metadata.isAuthorized.owner === message.token.sub) {
                  (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee() {
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return sendMessage(socket, {
                              type: 'event',
                              payload: event,
                              statusCode: 200,
                              procedureId: message.procedureId
                            });

                          case 3:
                            _context.next = 8;
                            break;

                          case 5:
                            _context.prev = 5;
                            _context.t0 = _context["catch"](0);
                            logger.error('Failed to send message.', {
                              ex: _context.t0
                            });

                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, null, [[0, 5]]);
                  }))();
                }
              };

              unsubscribe = function unsubscribe() {
                app.api.outgoing.removeListener('data', sendToClient);
              };

              subscriptions[socket.uniqueId] = subscriptions[socket.uniqueId] || {};
              subscriptions[socket.uniqueId][message.procedureId] = unsubscribe;
              app.api.outgoing.on('data', sendToClient);
              _context2.prev = 14;
              _context2.next = 17;
              return sendMessage(socket, {
                type: 'subscribedEvents',
                statusCode: 200,
                procedureId: message.procedureId
              });

            case 17:
              _context2.next = 22;
              break;

            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2["catch"](14);
              logger.error('Failed to send message.', {
                ex: _context2.t0
              });

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[14, 19]]);
    }));

    function subscribe(_x, _x2) {
      return _subscribe.apply(this, arguments);
    }

    return subscribe;
  }(),
  unsubscribe: function () {
    var _unsubscribe = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee3(socket, _ref3) {
      var app, message, logger, unsubscribe;
      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              app = _ref3.app, message = _ref3.message;

              if (socket) {
                _context3.next = 3;
                break;
              }

              throw new Error('Socket is missing.');

            case 3:
              if (app) {
                _context3.next = 5;
                break;
              }

              throw new Error('App is missing.');

            case 5:
              if (message) {
                _context3.next = 7;
                break;
              }

              throw new Error('Message is missing.');

            case 7:
              logger = app.services.getLogger();

              if (!(!subscriptions[socket.uniqueId] || !subscriptions[socket.uniqueId][message.procedureId])) {
                _context3.next = 10;
                break;
              }

              return _context3.abrupt("return");

            case 10:
              unsubscribe = subscriptions[socket.uniqueId][message.procedureId];
              unsubscribe();
              _context3.prev = 12;
              _context3.next = 15;
              return sendMessage(socket, {
                type: 'unsubscribedEvents',
                statusCode: 200,
                procedureId: message.procedureId
              });

            case 15:
              _context3.next = 20;
              break;

            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3["catch"](12);
              logger.error('Failed to send message.', {
                ex: _context3.t0
              });

            case 20:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[12, 17]]);
    }));

    function unsubscribe(_x3, _x4) {
      return _unsubscribe.apply(this, arguments);
    }

    return unsubscribe;
  }(),
  removeAllListenersFor: function removeAllListenersFor(socket) {
    if (!socket) {
      throw new Error('Socket is missing.');
    }

    if (!subscriptions[socket.uniqueId]) {
      return;
    }

    Object.keys(subscriptions[socket.uniqueId]).forEach(function (procedureId) {
      var unsubscribe = subscriptions[socket.uniqueId][procedureId];
      unsubscribe();
    });
  }
};
module.exports = postEvents;