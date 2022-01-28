'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var sendMessage = require('./wsSendMessage'),
    validateQuery = require('./validateQuery');

var subscriptions = {};
var postRead = {
  subscribe: function () {
    var _subscribe = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee4(socket, _ref) {
      var app, message, readModel, logger, _message$payload, modelName, modelType, _message$payload$quer, query, _query$orderBy, orderBy, _query$skip, skip, _query$take, take, _query$where, where, authenticationWhere, stream, onData, onEnd, onError, unsubscribe;

      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              app = _ref.app, message = _ref.message, readModel = _ref.readModel;

              if (socket) {
                _context4.next = 3;
                break;
              }

              throw new Error('Socket is missing.');

            case 3:
              if (app) {
                _context4.next = 5;
                break;
              }

              throw new Error('App is missing.');

            case 5:
              if (message) {
                _context4.next = 7;
                break;
              }

              throw new Error('Message is missing.');

            case 7:
              if (readModel) {
                _context4.next = 9;
                break;
              }

              throw new Error('Read model is missing.');

            case 9:
              logger = app.services.getLogger();

              if (message.payload) {
                _context4.next = 20;
                break;
              }

              _context4.prev = 11;
              _context4.next = 14;
              return sendMessage(socket, {
                type: 'error',
                payload: 'Payload is missing.',
                statusCode: 400,
                procedureId: message.procedureId
              });

            case 14:
              _context4.next = 19;
              break;

            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4["catch"](11);
              logger.error('Failed to send message.', {
                ex: _context4.t0
              });

            case 19:
              return _context4.abrupt("return");

            case 20:
              _message$payload = message.payload, modelName = _message$payload.modelName, modelType = _message$payload.modelType, _message$payload$quer = _message$payload.query, query = _message$payload$quer === void 0 ? {} : _message$payload$quer;
              _query$orderBy = query.orderBy, orderBy = _query$orderBy === void 0 ? {} : _query$orderBy;
              _query$skip = query.skip, skip = _query$skip === void 0 ? 0 : _query$skip, _query$take = query.take, take = _query$take === void 0 ? 100 : _query$take, _query$where = query.where, where = _query$where === void 0 ? {} : _query$where;

              if (typeof skip !== 'number') {
                skip = 0;
              }

              if (typeof take !== 'number') {
                take = 100;
              }

              if (readModel[modelType]) {
                _context4.next = 35;
                break;
              }

              _context4.prev = 26;
              _context4.next = 29;
              return sendMessage(socket, {
                type: 'error',
                payload: 'Unknown model type.',
                statusCode: 400,
                procedureId: message.procedureId
              });

            case 29:
              _context4.next = 34;
              break;

            case 31:
              _context4.prev = 31;
              _context4.t1 = _context4["catch"](26);
              logger.error('Failed to send message.', {
                ex: _context4.t1
              });

            case 34:
              return _context4.abrupt("return");

            case 35:
              if (readModel[modelType][modelName]) {
                _context4.next = 45;
                break;
              }

              _context4.prev = 36;
              _context4.next = 39;
              return sendMessage(socket, {
                type: 'error',
                payload: 'Unknown model name.',
                statusCode: 400,
                procedureId: message.procedureId
              });

            case 39:
              _context4.next = 44;
              break;

            case 41:
              _context4.prev = 41;
              _context4.t2 = _context4["catch"](36);
              logger.error('Failed to send message.', {
                ex: _context4.t2
              });

            case 44:
              return _context4.abrupt("return");

            case 45:
              _context4.prev = 45;
              validateQuery({
                orderBy: orderBy,
                skip: skip,
                take: take,
                where: where
              });
              _context4.next = 60;
              break;

            case 49:
              _context4.prev = 49;
              _context4.t3 = _context4["catch"](45);
              _context4.prev = 51;
              _context4.next = 54;
              return sendMessage(socket, {
                type: 'error',
                payload: 'Invalid query.',
                statusCode: 400,
                procedureId: message.procedureId
              });

            case 54:
              _context4.next = 59;
              break;

            case 56:
              _context4.prev = 56;
              _context4.t4 = _context4["catch"](51);
              logger.error('Failed to send message.', {
                exSendMessage: _context4.t4
              });

            case 59:
              return _context4.abrupt("return");

            case 60:
              authenticationWhere = [{
                'isAuthorized.owner': message.token.sub
              }, {
                'isAuthorized.forPublic': true
              }];

              if (message.token.sub !== 'anonymous') {
                authenticationWhere.push({
                  'isAuthorized.forAuthenticated': true
                });
              }

              where = {
                $and: [where, {
                  $or: authenticationWhere
                }]
              };
              _context4.prev = 63;
              _context4.next = 66;
              return app.api.read(modelType, modelName, {
                where: where,
                orderBy: orderBy,
                take: take,
                skip: skip,
                user: {
                  id: message.token.sub,
                  token: message.token
                }
              });

            case 66:
              stream = _context4.sent;
              _context4.next = 80;
              break;

            case 69:
              _context4.prev = 69;
              _context4.t5 = _context4["catch"](63);
              _context4.prev = 71;
              _context4.next = 74;
              return sendMessage(socket, {
                type: 'error',
                payload: 'Unable to load model.',
                statusCode: 500,
                procedureId: message.procedureId
              });

            case 74:
              _context4.next = 79;
              break;

            case 76:
              _context4.prev = 76;
              _context4.t6 = _context4["catch"](71);
              logger.error('Failed to send message.', {
                exSendMessage: _context4.t6
              });

            case 79:
              return _context4.abrupt("return");

            case 80:
              unsubscribe = function unsubscribe() {
                stream.removeListener('data', onData);
                stream.removeListener('end', onEnd);
                stream.removeListener('error', onError);
                stream.end();
              };

              subscriptions[socket.uniqueId] = subscriptions[socket.uniqueId] || {};
              subscriptions[socket.uniqueId][message.procedureId] = unsubscribe;

              onData = function onData(data) {
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
                            type: 'item',
                            payload: data,
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
              };

              onEnd = function onEnd() {
                unsubscribe();
                (0, _asyncToGenerator2.default)(
                /*#__PURE__*/
                _regenerator.default.mark(function _callee2() {
                  return _regenerator.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.prev = 0;
                          _context2.next = 3;
                          return sendMessage(socket, {
                            type: 'finish',
                            statusCode: 200,
                            procedureId: message.procedureId
                          });

                        case 3:
                          _context2.next = 8;
                          break;

                        case 5:
                          _context2.prev = 5;
                          _context2.t0 = _context2["catch"](0);
                          logger.error('Failed to send message.', {
                            ex: _context2.t0
                          });

                        case 8:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, null, [[0, 5]]);
                }))();
              };

              onError = function onError(err) {
                unsubscribe();
                (0, _asyncToGenerator2.default)(
                /*#__PURE__*/
                _regenerator.default.mark(function _callee3() {
                  return _regenerator.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.prev = 0;
                          _context3.next = 3;
                          return sendMessage(socket, {
                            type: 'error',
                            statusCode: 500,
                            procedureId: message.procedureId,
                            payload: err
                          });

                        case 3:
                          _context3.next = 8;
                          break;

                        case 5:
                          _context3.prev = 5;
                          _context3.t0 = _context3["catch"](0);
                          logger.error('Failed to send message.', {
                            ex: _context3.t0
                          });

                        case 8:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3, null, [[0, 5]]);
                }))();
              };

              stream.on('data', onData);
              stream.on('end', onEnd);
              stream.on('error', onError);
              _context4.prev = 89;
              _context4.next = 92;
              return sendMessage(socket, {
                type: 'subscribedRead',
                statusCode: 200,
                procedureId: message.procedureId
              });

            case 92:
              _context4.next = 97;
              break;

            case 94:
              _context4.prev = 94;
              _context4.t7 = _context4["catch"](89);
              logger.error('Failed to send message.', {
                ex: _context4.t7
              });

            case 97:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[11, 16], [26, 31], [36, 41], [45, 49], [51, 56], [63, 69], [71, 76], [89, 94]]);
    }));

    function subscribe(_x, _x2) {
      return _subscribe.apply(this, arguments);
    }

    return subscribe;
  }(),
  unsubscribe: function () {
    var _unsubscribe = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee5(socket, _ref5) {
      var app, message, logger, unsubscribe;
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              app = _ref5.app, message = _ref5.message;

              if (socket) {
                _context5.next = 3;
                break;
              }

              throw new Error('Socket is missing.');

            case 3:
              if (app) {
                _context5.next = 5;
                break;
              }

              throw new Error('App is missing.');

            case 5:
              if (message) {
                _context5.next = 7;
                break;
              }

              throw new Error('Message is missing.');

            case 7:
              logger = app.services.getLogger();

              if (!(!subscriptions[socket.uniqueId] || !subscriptions[socket.uniqueId][message.procedureId])) {
                _context5.next = 10;
                break;
              }

              return _context5.abrupt("return");

            case 10:
              unsubscribe = subscriptions[socket.uniqueId][message.procedureId];
              unsubscribe();
              _context5.prev = 12;
              _context5.next = 15;
              return sendMessage(socket, {
                type: 'unsubscribedRead',
                statusCode: 200,
                procedureId: message.procedureId
              });

            case 15:
              _context5.next = 20;
              break;

            case 17:
              _context5.prev = 17;
              _context5.t0 = _context5["catch"](12);
              logger.error('Failed to send message.', {
                ex: _context5.t0
              });

            case 20:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[12, 17]]);
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
module.exports = postRead;