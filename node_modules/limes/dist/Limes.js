'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var jwt = require('jsonwebtoken');

var IdentityProvider = require('./IdentityProvider');

var Limes =
/*#__PURE__*/
function () {
  function Limes(_ref) {
    var identityProviders = _ref.identityProviders;
    (0, _classCallCheck2.default)(this, Limes);

    if (!identityProviders) {
      throw new Error('Identity providers are missing.');
    }

    if (identityProviders.length === 0) {
      throw new Error('Identity providers are missing.');
    }

    this.identityProviders = identityProviders;
  }

  (0, _createClass2.default)(Limes, [{
    key: "getIdentityProviderByIssuer",
    value: function getIdentityProviderByIssuer(_ref2) {
      var issuer = _ref2.issuer;

      if (!issuer) {
        throw new Error('Issuer is missing.');
      }

      var requestedIdentityProvider = this.identityProviders.find(function (identityProvider) {
        return identityProvider.issuer === issuer;
      });

      if (!requestedIdentityProvider) {
        throw new Error("Issuer '".concat(issuer, "' not found."));
      }

      return requestedIdentityProvider;
    }
  }, {
    key: "issueToken",
    value: function issueToken(_ref3) {
      var issuer = _ref3.issuer,
          subject = _ref3.subject,
          _ref3$payload = _ref3.payload,
          payload = _ref3$payload === void 0 ? {} : _ref3$payload;

      if (!issuer) {
        throw new Error('Issuer is missing.');
      }

      if (!subject) {
        throw new Error('Subject is missing.');
      }

      var identityProvider = this.getIdentityProviderByIssuer({
        issuer: issuer
      });
      var token = jwt.sign(payload, identityProvider.privateKey, {
        algorithm: 'RS256',
        subject: subject,
        issuer: identityProvider.issuer,
        expiresIn: identityProvider.expiresInMinutes * 60
      });
      return token;
    }
  }, {
    key: "verifyToken",
    value: function () {
      var _verifyToken = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(_ref4) {
        var token, untrustedDecodedToken, identityProvider, decodedToken;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                token = _ref4.token;

                if (token) {
                  _context.next = 3;
                  break;
                }

                throw new Error('Token is missing.');

              case 3:
                _context.prev = 3;
                untrustedDecodedToken = jwt.decode(token);
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](3);
                throw new Error('Failed to verify token.');

              case 10:
                if (untrustedDecodedToken) {
                  _context.next = 12;
                  break;
                }

                throw new Error('Failed to verify token.');

              case 12:
                identityProvider = this.getIdentityProviderByIssuer({
                  issuer: untrustedDecodedToken.iss
                });
                _context.next = 15;
                return new Promise(function (resolve, reject) {
                  try {
                    jwt.verify(token, identityProvider.certificate, {
                      algorithms: ['RS256'],
                      issuer: identityProvider.issuer
                    }, function (err, verifiedToken) {
                      if (err) {
                        return reject(new Error('Failed to verify token.'));
                      }

                      resolve(verifiedToken);
                    });
                  } catch (ex) {
                    reject(ex);
                  }
                });

              case 15:
                decodedToken = _context.sent;
                return _context.abrupt("return", decodedToken);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 7]]);
      }));

      function verifyToken(_x) {
        return _verifyToken.apply(this, arguments);
      }

      return verifyToken;
    }()
  }, {
    key: "verifyTokenMiddleware",
    value: function verifyTokenMiddleware(_ref5) {
      var _this = this;

      var issuerForAnonymousTokens = _ref5.issuerForAnonymousTokens;

      if (!issuerForAnonymousTokens) {
        throw new Error('Issuer for anonymous tokens is missing.');
      }

      return (
        /*#__PURE__*/
        function () {
          var _ref6 = (0, _asyncToGenerator2.default)(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee2(req, res, next) {
            var token, authorizationHeader, authorizationQuery, _authorizationHeader$, _authorizationHeader$2, authorizationType, authorizationValue, decodedToken;

            return _regenerator.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    authorizationHeader = req.headers.authorization, authorizationQuery = req.query.token;

                    if (authorizationHeader) {
                      _authorizationHeader$ = authorizationHeader.split(' '), _authorizationHeader$2 = (0, _slicedToArray2.default)(_authorizationHeader$, 2), authorizationType = _authorizationHeader$2[0], authorizationValue = _authorizationHeader$2[1];

                      if (authorizationType === 'Bearer') {
                        token = authorizationValue;
                      }
                    } else if (authorizationQuery) {
                      token = authorizationQuery;
                    }

                    if (!token) {
                      _context2.next = 14;
                      break;
                    }

                    _context2.prev = 3;
                    _context2.next = 6;
                    return _this.verifyToken({
                      token: token
                    });

                  case 6:
                    decodedToken = _context2.sent;
                    _context2.next = 12;
                    break;

                  case 9:
                    _context2.prev = 9;
                    _context2.t0 = _context2["catch"](3);
                    return _context2.abrupt("return", res.status(401).end());

                  case 12:
                    _context2.next = 15;
                    break;

                  case 14:
                    decodedToken = Limes.issueUntrustedTokenAsJson({
                      issuer: issuerForAnonymousTokens,
                      subject: 'anonymous'
                    });

                  case 15:
                    req.user = decodedToken;
                    next();

                  case 17:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, null, [[3, 9]]);
          }));

          return function (_x2, _x3, _x4) {
            return _ref6.apply(this, arguments);
          };
        }()
      );
    }
  }], [{
    key: "issueUntrustedTokenAsJson",
    value: function issueUntrustedTokenAsJson(_ref7) {
      var issuer = _ref7.issuer,
          subject = _ref7.subject,
          _ref7$payload = _ref7.payload,
          payload = _ref7$payload === void 0 ? {} : _ref7$payload;

      if (!issuer) {
        throw new Error('Issuer is missing.');
      }

      if (!subject) {
        throw new Error('Subject is missing.');
      }

      var expiresInMinutes = 60;
      var encodedToken = jwt.sign(payload, null, {
        algorithm: 'none',
        subject: subject,
        issuer: issuer,
        expiresIn: expiresInMinutes * 60
      });
      var token = jwt.decode(encodedToken);
      return token;
    }
  }]);
  return Limes;
}();

Limes.IdentityProvider = IdentityProvider;
module.exports = Limes;