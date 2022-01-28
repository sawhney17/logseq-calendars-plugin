'use strict';

const jwt = require('jsonwebtoken');

const IdentityProvider = require('./IdentityProvider');

class Limes {
  constructor ({ identityProviders }) {
    if (!identityProviders) {
      throw new Error('Identity providers are missing.');
    }
    if (identityProviders.length === 0) {
      throw new Error('Identity providers are missing.');
    }

    this.identityProviders = identityProviders;
  }

  getIdentityProviderByIssuer ({ issuer }) {
    if (!issuer) {
      throw new Error('Issuer is missing.');
    }

    const requestedIdentityProvider = this.identityProviders.find(
      identityProvider => identityProvider.issuer === issuer
    );

    if (!requestedIdentityProvider) {
      throw new Error(`Issuer '${issuer}' not found.`);
    }

    return requestedIdentityProvider;
  }

  issueToken ({
    issuer,
    subject,
    payload = {}
  }) {
    if (!issuer) {
      throw new Error('Issuer is missing.');
    }
    if (!subject) {
      throw new Error('Subject is missing.');
    }

    const identityProvider = this.getIdentityProviderByIssuer({ issuer });

    const token = jwt.sign(payload, identityProvider.privateKey, {
      algorithm: 'RS256',
      subject,
      issuer: identityProvider.issuer,
      expiresIn: identityProvider.expiresInMinutes * 60
    });

    return token;
  }

  static issueUntrustedTokenAsJson ({
    issuer,
    subject,
    payload = {}
  }) {
    if (!issuer) {
      throw new Error('Issuer is missing.');
    }
    if (!subject) {
      throw new Error('Subject is missing.');
    }

    const expiresInMinutes = 60;

    const encodedToken = jwt.sign(payload, null, {
      algorithm: 'none',
      subject,
      issuer,
      expiresIn: expiresInMinutes * 60
    });

    const token = jwt.decode(encodedToken);

    return token;
  }

  async verifyToken ({ token }) {
    if (!token) {
      throw new Error('Token is missing.');
    }

    let untrustedDecodedToken;

    try {
      untrustedDecodedToken = jwt.decode(token);
    } catch (ex) {
      throw new Error('Failed to verify token.');
    }

    if (!untrustedDecodedToken) {
      throw new Error('Failed to verify token.');
    }

    const identityProvider = this.getIdentityProviderByIssuer({
      issuer: untrustedDecodedToken.iss
    });

    const decodedToken = await new Promise((resolve, reject) => {
      try {
        jwt.verify(token, identityProvider.certificate, {
          algorithms: [ 'RS256' ],
          issuer: identityProvider.issuer
        }, (err, verifiedToken) => {
          if (err) {
            return reject(new Error('Failed to verify token.'));
          }

          resolve(verifiedToken);
        });
      } catch (ex) {
        reject(ex);
      }
    });

    return decodedToken;
  }

  verifyTokenMiddleware ({ issuerForAnonymousTokens }) {
    if (!issuerForAnonymousTokens) {
      throw new Error('Issuer for anonymous tokens is missing.');
    }

    return async (req, res, next) => {
      let token;

      const authorizationHeader = req.headers.authorization,
            authorizationQuery = req.query.token;

      if (authorizationHeader) {
        const [ authorizationType, authorizationValue ] = authorizationHeader.split(' ');

        if (authorizationType === 'Bearer') {
          token = authorizationValue;
        }
      } else if (authorizationQuery) {
        token = authorizationQuery;
      }

      let decodedToken;

      if (token) {
        try {
          decodedToken = await this.verifyToken({ token });
        } catch (ex) {
          return res.status(401).end();
        }
      } else {
        decodedToken = Limes.issueUntrustedTokenAsJson({
          issuer: issuerForAnonymousTokens,
          subject: 'anonymous'
        });
      }

      req.user = decodedToken;
      next();
    };
  }
}

Limes.IdentityProvider = IdentityProvider;

module.exports = Limes;
