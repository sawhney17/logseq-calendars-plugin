# limes

limes authenticates users.

## Installation

```shell
$ npm install limes
```

## Quick start

First you need to add a reference to limes in your application:

```javascript
const Limes = require('limes');
```

Now you need to create one or more identity providers. For each identity provider call the `Limes.IdentityProvider` constructor and hand over the `issuer` as well as a `privateKey` or a `certificate`, each in `.pem` format. Optionally, you may provide both:

```javascript
const identityProvider = new Limes.IdentityProvider({
  issuer: 'https://auth.thenativeweb.io',
  privateKey: await readFile(path.join(__dirname, 'privateKey.pem')),
  certificate: await readFile(path.join(__dirname, 'certificate.pem'))
});
```

_Please note that you have to specify the private key if you want to issue tokens and the certificate if you want to verify them._

Then you can call the `Limes` constructor function to create a new limes instance. Hand over an array of one or more of the previously created identity providers:

```javascript
const limes = new Limes({
  identityProviders: [ identityProvider ]
});
```

### Issuing tokens

To issue a token call the `issueToken` function and provide the `issuer` and the `subject` you want to use as well as an optional payload:

```javascript
const token = limes.issueToken({
  issuer: 'https://auth.thenativeweb.io',
  subject: 'jane.doe',
  payload: {
    'https://auth.thenativeweb.io/email': 'jane.doe@thenativeweb.io'
  }
});
```

_Please note that the issuer must match one of the registered identity providers. Otherwise, `issueToken` will throw an error._

#### Issuing untrusted tokens for testing

From time to time, e.g. for testing, you may want to get a JSON object that looks like a decoded token, but avoid the effort to create a signed token first. For this, use the static `issueUntrustedTokenAsJson` function and hand over the desired `issuer`, the `subject`, and an optional `payload`:

```javascript
const decodedToken = Limes.issueUntrustedTokenAsJson({
  issuer: 'https://untrusted.thenativeweb.io',
  subject: 'jane.doe'
});
```

_Please note that this is highly insecure, and should never be used for production code!_

### Verifying tokens

To verify a token call the `verifyToken` function and provide the token. This function tries to verify and decode the token using the identity provider that matches the token's `iss` value and returns the decoded token:

```javascript
const decodedToken = await limes.verifyToken({ token });
```

If no identity provider for the token's `iss` value is found, an exception is thrown. Also, an exception is thrown if the token is invalid.

### Using middleware

To verify tokens in web applications, there is a middleware for Express. To use it call the `verifyTokenMiddleware` function and hand over a made-up issuer value you want to use for anonymous tokens:

```javascript
app.use(limes.verifyTokenMiddleware({
  issuerForAnonymousTokens: 'https://anonymous.thenativeweb.io'
}));
```

_Please note that the issuer for anonymous tokens is made-up, and does not provide any security. It's just a string that is used without further validation._

The middleware expects the token to be inside the `authorization` HTTP header, prefixed with the term `Bearer`:

    authorization: Bearer <token>

Alternatively, you may transfer the token using the query string parameter `token`:

    GET /foo/bar?token=<token>

Either way, the verified and decoded token will be attached to the `req.user` property:

```javascript
const app = express();

app.use(limes.verifyTokenMiddleware({
  issuerForAnonymousTokens: 'https://anonymous.thenativeweb.io'
}));

app.get('/', (req, res) => {
  res.json(req.user);
});
```

If a request does not provide a token, a token for an anonymous user will be issued. This issue uses `anonymous` for the `sub` property, and the aforementioned issuer for anonymous tokens.

_Please make sure that your application code handles anonymous users in an intended way! The middleware does not block anonymous users, it just identifies and marks them!_

If a request does have an invalid token, an expired one, or one from an unknown issuer, the middleware returns the status code `401`.

## Running the build

```shell
$ npx roboter
```

## License

The MIT License (MIT)
Copyright (c) 2014-2019 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
