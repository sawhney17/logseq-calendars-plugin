'use strict';

const fs = require('fs'),
      path = require('path');

const Limes = require('limes');

const limes = new Limes({
  identityProviders: [
    /* eslint-disable no-sync */
    new Limes.IdentityProvider({
      issuer: 'https://auth.thenativeweb.io',
      privateKey: fs.readFileSync(path.join(__dirname, 'keys', 'privateKey.pem')),
      certificate: fs.readFileSync(path.join(__dirname, 'keys', 'certificate.pem'))
    })
    /* eslint-enable no-sync */
  ]
});

const issueToken = function (subject, payload) {
  return limes.issueToken({
    issuer: 'https://auth.thenativeweb.io',
    subject,
    payload
  });
};

module.exports = issueToken;
