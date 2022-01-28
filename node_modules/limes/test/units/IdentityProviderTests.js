'use strict';

const fs = require('fs'),
      path = require('path');

const assert = require('assertthat');

const IdentityProvider = require('../../src/IdentityProvider');

/* eslint-disable no-sync */
const certificate = fs.readFileSync(path.join(__dirname, '..', 'shared', 'keys', 'auth.thenativeweb.io', 'certificate.pem')),
      privateKey = fs.readFileSync(path.join(__dirname, '..', 'shared', 'keys', 'auth.thenativeweb.io', 'privateKey.pem'));
/* eslint-enable no-sync */

suite('IdentityProvider', () => {
  test('is a function.', async () => {
    assert.that(IdentityProvider).is.ofType('function');
  });

  test('throws an error if issuer is missing.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new IdentityProvider({});
      /* eslint-enable no-new */
    }).is.throwing('Issuer is missing.');
  });

  test('throws an error if private key and certificate is missing.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new IdentityProvider({ issuer: 'https://auth.thenativeweb.io/' });
      /* eslint-enable no-new */
    }).is.throwing('Private key and / or certificate is missing.');
  });

  test('does not throw an error if a private key is given.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new IdentityProvider({
        issuer: 'https://auth.thenativeweb.io/',
        privateKey
      });
      /* eslint-enable no-new */
    }).is.not.throwing();
  });

  test('does not throw an error if a certificate is given.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new IdentityProvider({
        issuer: 'https://auth.thenativeweb.io/',
        certificate
      });
      /* eslint-enable no-new */
    }).is.not.throwing();
  });
});
