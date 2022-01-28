'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Limes = require('limes'),
    uuid = require('uuidv4'),
    WebSocket = require('ws');

var v1 = require('./v1/wsIndex');

var wsServer = function wsServer(_ref) {
  var app = _ref.app,
      httpServer = _ref.httpServer,
      readModel = _ref.readModel,
      writeModel = _ref.writeModel;

  if (!app) {
    throw new Error('App is missing.');
  }

  if (!httpServer) {
    throw new Error('Http server is missing.');
  }

  if (!readModel) {
    throw new Error('Read model is missing.');
  }

  if (!writeModel) {
    throw new Error('Write model is missing.');
  }

  var logger = app.services.getLogger();
  var webSocketServer = new WebSocket.Server({
    server: httpServer
  });
  var limes = new Limes({
    identityProviders: app.identityProviders
  });
  webSocketServer.on('connection', function (socket) {
    // Currently, sockets do not have a unique identifier. That's why we make up
    // our own here. To avoid overwriting a future uniqueId property we have an
    // additional sanity check here.
    if (socket.uniqueId) {
      throw new Error('Sockets now have a uniqueId property by default.');
    }

    socket.uniqueId = uuid();

    var onMessage =
    /*#__PURE__*/
    function () {
      var _ref2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(data) {
        var message, api, decodedToken;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                message = JSON.parse(data);
                _context.next = 15;
                break;

              case 4:
                _context.prev = 4;
                _context.t0 = _context["catch"](0);
                _context.prev = 6;
                _context.next = 9;
                return v1.sendMessage(socket, {
                  type: 'error',
                  statusCode: 400,
                  payload: 'Bad request.'
                });

              case 9:
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t1 = _context["catch"](6);
                logger.error('Failed to send message.', {
                  exSendMessage: _context.t1
                });

              case 14:
                return _context.abrupt("return");

              case 15:
                _context.t2 = message.version;
                _context.next = _context.t2 === 'v1' ? 18 : 20;
                break;

              case 18:
                api = v1;
                return _context.abrupt("break", 29);

              case 20:
                _context.prev = 20;
                _context.next = 23;
                return v1.sendMessage(socket, {
                  type: 'error',
                  statusCode: 400,
                  payload: 'Bad request.'
                });

              case 23:
                _context.next = 28;
                break;

              case 25:
                _context.prev = 25;
                _context.t3 = _context["catch"](20);
                logger.error('Failed to send message.', {
                  ex: _context.t3
                });

              case 28:
                return _context.abrupt("return");

              case 29:
                if (message.procedureId) {
                  _context.next = 39;
                  break;
                }

                _context.prev = 30;
                _context.next = 33;
                return api.sendMessage(socket, {
                  type: 'error',
                  statusCode: 400,
                  payload: 'Procedure id is missing.'
                });

              case 33:
                _context.next = 38;
                break;

              case 35:
                _context.prev = 35;
                _context.t4 = _context["catch"](30);
                logger.error('Failed to send message.', {
                  ex: _context.t4
                });

              case 38:
                return _context.abrupt("return");

              case 39:
                if (uuid.is(message.procedureId)) {
                  _context.next = 49;
                  break;
                }

                _context.prev = 40;
                _context.next = 43;
                return api.sendMessage(socket, {
                  type: 'error',
                  statusCode: 400,
                  payload: 'Procedure id is invalid.'
                });

              case 43:
                _context.next = 48;
                break;

              case 45:
                _context.prev = 45;
                _context.t5 = _context["catch"](40);
                logger.error('Failed to send message.', {
                  ex: _context.t5
                });

              case 48:
                return _context.abrupt("return");

              case 49:
                if (message.token) {
                  _context.next = 55;
                  break;
                }

                message.token = Limes.issueUntrustedTokenAsJson({
                  // According to RFC 2606, .invalid is a reserved TLD you can use in
                  // cases where you want to show that a domain is invalid. Since the
                  // tokens issued for anonymous users are made-up, https://token.invalid
                  // makes up a valid url, but we are sure that we do not run into any
                  // conflicts with the domain.
                  issuer: 'https://token.invalid',
                  subject: 'anonymous'
                });
                _context.next = 53;
                return api.handleMessage(socket, {
                  app: app,
                  message: message,
                  readModel: readModel,
                  writeModel: writeModel
                });

              case 53:
                _context.next = 75;
                break;

              case 55:
                _context.prev = 55;
                _context.next = 58;
                return limes.verifyToken({
                  token: message.token
                });

              case 58:
                decodedToken = _context.sent;
                _context.next = 72;
                break;

              case 61:
                _context.prev = 61;
                _context.t6 = _context["catch"](55);
                _context.prev = 63;
                _context.next = 66;
                return api.sendMessage(socket, {
                  type: 'error',
                  statusCode: 401,
                  payload: 'Invalid token.',
                  procedureId: message.procedureId
                });

              case 66:
                _context.next = 71;
                break;

              case 68:
                _context.prev = 68;
                _context.t7 = _context["catch"](63);
                logger.error('Failed to send message.', {
                  exSendMessage: _context.t7
                });

              case 71:
                return _context.abrupt("return");

              case 72:
                message.token = decodedToken;
                _context.next = 75;
                return api.handleMessage(socket, {
                  app: app,
                  message: message,
                  readModel: readModel,
                  writeModel: writeModel
                });

              case 75:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 4], [6, 11], [20, 25], [30, 35], [40, 45], [55, 61], [63, 68]]);
      }));

      return function onMessage(_x) {
        return _ref2.apply(this, arguments);
      };
    }();

    var onClose = function onClose() {
      v1.postEvents.removeAllListenersFor(socket);
      v1.postRead.removeAllListenersFor(socket);
      socket.removeEventListener('message', onMessage);
      socket.removeEventListener('close', onClose);
    };

    socket.on('close', onClose);
    socket.on('message', onMessage);
  });
};

module.exports = wsServer;