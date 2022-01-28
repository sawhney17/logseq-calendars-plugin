'use strict';

const minutesPerDay = 24 * 60;

class IdentityProvider {
  constructor ({
    issuer,
    privateKey,
    certificate,
    expiresInMinutes = minutesPerDay
  }) {
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
  }
}

module.exports = IdentityProvider;
