'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var minutesPerDay = 24 * 60;

var IdentityProvider = function IdentityProvider(_ref) {
  var issuer = _ref.issuer,
      privateKey = _ref.privateKey,
      certificate = _ref.certificate,
      _ref$expiresInMinutes = _ref.expiresInMinutes,
      expiresInMinutes = _ref$expiresInMinutes === void 0 ? minutesPerDay : _ref$expiresInMinutes;
  (0, _classCallCheck2.default)(this, IdentityProvider);

  if (!issuer) {
    throw new Error('Issuer is missing.');
  }

  if (!privateKey && !certificate) {
    throw new Error('Private key and / or certificate is missing.');
  }

  this.issuer = issuer;
  this.privateKey = privateKey;
  this.certificate = certificate;
  this.expiresInMinutes = expiresInMinutes;
};

module.exports = IdentityProvider;