'use strict';

const fs = require('fs'),
      path = require('path');

const assert = require('assertthat'),
      express = require('express'),
      jwt = require('jsonwebtoken'),
      request = require('supertest');

const IdentityProvider = require('../../src/IdentityProvider'),
      Limes = require('../../src/Limes');

/* eslint-disable no-sync */
const keys = {
  thenativeweb: {
    certificate: fs.readFileSync(path.join(__dirname, '..', 'shared', 'keys', 'auth.thenativeweb.io', 'certificate.pem')),
    privateKey: fs.readFileSync(path.join(__dirname, '..', 'shared', 'keys', 'auth.thenativeweb.io', 'privateKey.pem'))
  },
  intuity: {
    certificate: fs.readFileSync(path.join(__dirname, '..', 'shared', 'keys', 'auth.intuity.de', 'certificate.pem')),
    privateKey: fs.readFileSync(path.join(__dirname, '..', 'shared', 'keys', 'auth.intuity.de', 'privateKey.pem'))
  },
  example: {
    certificate: fs.readFileSync(path.join(__dirname, '..', 'shared', 'keys', 'auth.example.com', 'certificate.pem')),
    privateKey: fs.readFileSync(path.join(__dirname, '..', 'shared', 'keys', 'auth.example.com', 'privateKey.pem'))
  }
};
/* eslint-enable no-sync */

suite('Limes', () => {
  const identityProviderThenativeweb = new Limes.IdentityProvider({
    issuer: 'https://auth.thenativeweb.io',
    privateKey: keys.thenativeweb.privateKey,
    certificate: keys.thenativeweb.certificate
  });

  const identityProviderIntuity = new Limes.IdentityProvider({
    issuer: 'https://auth.intuity.de',
    privateKey: keys.intuity.privateKey,
    certificate: keys.intuity.certificate
  });

  const identityProviderUnknown = new Limes.IdentityProvider({
    issuer: 'https://auth.example.com',
    privateKey: keys.example.privateKey,
    certificate: keys.example.certificate
  });

  const identityProviderExpired = new Limes.IdentityProvider({
    issuer: 'https://auth.thenativeweb.io',
    privateKey: keys.thenativeweb.privateKey,
    certificate: keys.thenativeweb.certificate,
    expiresInMinutes: -5
  });

  let limes;

  setup(() => {
    limes = new Limes({
      identityProviders: [ identityProviderThenativeweb, identityProviderIntuity ]
    });
  });

  test('is a function.', async () => {
    assert.that(Limes).is.ofType('function');
  });

  test('throws an exception if identity providers are missing.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Limes({});
      /* eslint-enable no-new */
    }).is.throwing('Identity providers are missing.');
  });

  test('throws an exception if identity providers are empty.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Limes({ identityProviders: []});
      /* eslint-enable no-new */
    }).is.throwing('Identity providers are missing.');
  });

  suite('IdentityProvider', () => {
    test('is the IdentityProvider constructor.', async () => {
      assert.that(Limes.IdentityProvider).is.sameAs(IdentityProvider);
    });
  });

  suite('getIdentityProviderByIssuer', () => {
    test('is a function.', async () => {
      assert.that(limes.getIdentityProviderByIssuer).is.ofType('function');
    });

    test('throws an error if issuer is missing.', async () => {
      assert.that(() => {
        limes.getIdentityProviderByIssuer({});
      }).is.throwing('Issuer is missing.');
    });

    test('throws an error if issuer does not exist.', async () => {
      assert.that(() => {
        limes.getIdentityProviderByIssuer({ issuer: 'https://auth.example.com' });
      }).is.throwing(`Issuer 'https://auth.example.com' not found.`);
    });

    test('returns the requested identity provider.', async () => {
      const identityProvider = limes.getIdentityProviderByIssuer({
        issuer: 'https://auth.thenativeweb.io'
      });

      assert.that(identityProvider).is.sameAs(identityProviderThenativeweb);
    });
  });

  suite('issueToken', () => {
    test('is a function.', async () => {
      assert.that(limes.issueToken).is.ofType('function');
    });

    test('throws an exception if issuer is missing.', async () => {
      assert.that(() => {
        limes.issueToken({});
      }).is.throwing('Issuer is missing.');
    });

    test('throws an exception if subject is missing.', async () => {
      assert.that(() => {
        limes.issueToken({ issuer: 'https://auth.thenativeweb.io' });
      }).is.throwing('Subject is missing.');
    });

    test('returns a JWT.', async () => {
      const token = limes.issueToken({
        issuer: 'https://auth.thenativeweb.io',
        subject: 'jane.doe'
      });

      const decodedToken = await jwt.verify(token, keys.thenativeweb.certificate, { issuer: 'https://auth.thenativeweb.io' });

      assert.that(decodedToken.iss).is.equalTo('https://auth.thenativeweb.io');
      assert.that(decodedToken.sub).is.equalTo('jane.doe');
    });

    test('returns a JWT with the given payload.', async () => {
      const token = limes.issueToken({
        issuer: 'https://auth.thenativeweb.io',
        subject: 'jane.doe',
        payload: {
          'https://auth.thenativeweb.io/email': 'jane.doe@thenativeweb.io'
        }
      });

      const decodedToken = await jwt.verify(token, keys.thenativeweb.certificate, { issuer: 'https://auth.thenativeweb.io' });

      assert.that(decodedToken.iss).is.equalTo('https://auth.thenativeweb.io');
      assert.that(decodedToken.sub).is.equalTo('jane.doe');
      assert.that(decodedToken['https://auth.thenativeweb.io/email']).is.equalTo('jane.doe@thenativeweb.io');
    });
  });

  suite('issueUntrustedTokenAsJson', () => {
    test('is a function.', async () => {
      assert.that(Limes.issueUntrustedTokenAsJson).is.ofType('function');
    });

    test('throws an exception if issuer is missing.', async () => {
      assert.that(() => {
        Limes.issueUntrustedTokenAsJson({});
      }).is.throwing('Issuer is missing.');
    });

    test('throws an exception if subject is missing.', async () => {
      assert.that(() => {
        Limes.issueUntrustedTokenAsJson({ issuer: 'https://untrusted.thenativeweb.io' });
      }).is.throwing('Subject is missing.');
    });

    test('returns a JWT.', async () => {
      const decodedToken = Limes.issueUntrustedTokenAsJson({
        issuer: 'https://untrusted.thenativeweb.io',
        subject: 'jane.doe'
      });

      assert.that(decodedToken.iss).is.equalTo('https://untrusted.thenativeweb.io');
      assert.that(decodedToken.sub).is.equalTo('jane.doe');
    });

    test('returns a JWT with the given payload.', async () => {
      const decodedToken = Limes.issueUntrustedTokenAsJson({
        issuer: 'https://untrusted.thenativeweb.io',
        subject: 'jane.doe',
        payload: {
          'https://untrusted.thenativeweb.io/email': 'jane.doe@thenativeweb.io'
        }
      });

      assert.that(decodedToken.iss).is.equalTo('https://untrusted.thenativeweb.io');
      assert.that(decodedToken.sub).is.equalTo('jane.doe');
      assert.that(decodedToken['https://untrusted.thenativeweb.io/email']).is.equalTo('jane.doe@thenativeweb.io');
    });
  });

  suite('verifyToken', () => {
    test('is a function.', async () => {
      assert.that(limes.verifyToken).is.ofType('function');
    });

    test('throws an error if token is missing.', async () => {
      await assert.that(async () => {
        await limes.verifyToken({});
      }).is.throwingAsync('Token is missing.');
    });

    test('returns the decoded token if the token is valid.', async () => {
      const token = limes.issueToken({
        issuer: 'https://auth.thenativeweb.io',
        subject: 'jane.doe'
      });

      const decodedToken = await limes.verifyToken({ token });

      assert.that(decodedToken.iss).is.equalTo('https://auth.thenativeweb.io');
      assert.that(decodedToken.sub).is.equalTo('jane.doe');
    });

    test('throws an error if the token is valid, but was issued by an unknown identity provider.', async () => {
      const otherLimes = new Limes({
        identityProviders: [ identityProviderUnknown ]
      });

      const token = otherLimes.issueToken({
        issuer: 'https://auth.example.com',
        subject: 'jane.doe'
      });

      await assert.that(async () => {
        await limes.verifyToken({ token });
      }).is.throwingAsync(`Issuer 'https://auth.example.com' not found.`);
    });

    test('throws an error if the token is not valid.', async () => {
      await assert.that(async () => {
        await limes.verifyToken({ token: 'invalidtoken' });
      }).is.throwingAsync('Failed to verify token.');
    });

    test('throws an error if the token contains invalid characters.', async () => {
      await assert.that(async () => {
        await limes.verifyToken({ token: 'invalid#token' });
      }).is.throwingAsync('Failed to verify token.');
    });
  });

  suite('verifyTokenMiddleware', () => {
    test('is a function.', async () => {
      assert.that(limes.verifyTokenMiddleware).is.ofType('function');
    });

    test('throws an error if issuer for anonymous tokens is missing.', async () => {
      assert.that(() => {
        limes.verifyTokenMiddleware({});
      }).is.throwing('Issuer for anonymous tokens is missing.');
    });

    test('returns a function.', async () => {
      const middleware = limes.verifyTokenMiddleware({
        issuerForAnonymousTokens: 'https://untrusted.thenativeweb.io'
      });

      assert.that(middleware).is.ofType('function');
    });

    suite('middleware', () => {
      let app;

      setup(() => {
        app = express();

        app.use(limes.verifyTokenMiddleware({
          issuerForAnonymousTokens: 'https://untrusted.thenativeweb.io'
        }));

        app.get('/', (req, res) => {
          res.json(req.user);
        });
      });

      test('returns an anonymous token for non-authenticated requests.', async () => {
        const { status, body } = await request(app).
          get('/').
          set('accept', 'application/json');

        assert.that(status).is.equalTo(200);
        assert.that(body.iss).is.equalTo('https://untrusted.thenativeweb.io');
        assert.that(body.sub).is.equalTo('anonymous');
      });

      test('returns 401 for invalid tokens.', async () => {
        await assert.that(async () => {
          await request(app).
            get('/').
            set('accept', 'application/json').
            set('authorization', 'Bearer invalidtoken');
        }).is.throwingAsync(ex => ex.status === 401);
      });

      test('returns 401 for tokens with invalid characters.', async () => {
        await assert.that(async () => {
          await request(app).
            get('/').
            set('accept', 'application/json').
            set('authorization', 'Bearer invalid#token');
        }).is.throwingAsync(ex => ex.status === 401);
      });

      test('returns 401 for expired tokens.', async () => {
        limes = new Limes({
          identityProviders: [ identityProviderExpired ]
        });

        const expiredToken = limes.issueToken({
          issuer: 'https://auth.thenativeweb.io',
          subject: 'jane.doe'
        });

        await assert.that(async () => {
          await request(app).
            get('/').
            set('accept', 'application/json').
            set('authorization', `Bearer ${expiredToken}`);
        }).is.throwingAsync(ex => ex.status === 401);
      });

      test('returns 401 for tokens that were issued by an unknown identity provider.', async () => {
        const otherLimes = new Limes({
          identityProviders: [ identityProviderUnknown ]
        });

        const token = otherLimes.issueToken({
          issuer: 'https://auth.example.com',
          subject: 'jane.doe'
        });

        await assert.that(async () => {
          await request(app).
            get('/').
            set('accept', 'application/json').
            set('authorization', `Bearer ${token}`);
        }).is.throwingAsync(ex => ex.status === 401);
      });

      test('returns a decoded token for valid tokens.', async () => {
        const token = limes.issueToken({
          issuer: 'https://auth.thenativeweb.io',
          subject: 'jane.doe'
        });

        const { status, body } = await request(app).
          get('/').
          set('accept', 'application/json').
          set('authorization', `Bearer ${token}`);

        assert.that(status).is.equalTo(200);
        assert.that(body.iss).is.equalTo('https://auth.thenativeweb.io');
        assert.that(body.sub).is.equalTo('jane.doe');
      });

      test('returns a decoded token for valid tokens sent using the query string.', async () => {
        const token = limes.issueToken({
          issuer: 'https://auth.thenativeweb.io',
          subject: 'jane.doe'
        });

        const { status, body } = await request(app).
          get(`/?token=${token}`).
          set('accept', 'application/json');

        assert.that(status).is.equalTo(200);
        assert.that(body.iss).is.equalTo('https://auth.thenativeweb.io');
        assert.that(body.sub).is.equalTo('jane.doe');
      });
    });
  });
});
