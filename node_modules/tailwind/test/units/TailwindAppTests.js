'use strict';

const path = require('path');

const assert = require('assertthat'),
      nodeenv = require('nodeenv'),
      uuid = require('uuidv4');

const TailwindApp = require('../../src/TailwindApp');

suite('TailwindApp', () => {
  test('is a function.', async () => {
    assert.that(TailwindApp).is.ofType('function');
  });

  test('throws an exception if identity providers are configured, but the issuer is missing.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new TailwindApp({
        identityProviders: [
          { certificate: path.join(__dirname, '..', 'shared', 'keys', 'certificate.pem') }
        ]
      });
      /* eslint-enable no-new */
    }).is.throwing('Identity provider issuer is missing.');
  });

  test('throws an exception if identity providers are configured, but the certificate is missing.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new TailwindApp({
        identityProviders: [
          { issuer: 'auth.wolkenkit.io' }
        ]
      });
      /* eslint-enable no-new */
    }).is.throwing('Identity provider certificate is missing.');
  });

  suite('dirname', () => {
    test('is a string.', async () => {
      const app = new TailwindApp();

      assert.that(app.dirname).is.ofType('string');
    });
  });

  suite('env', () => {
    let environmentVariableName;

    setup(() => {
      environmentVariableName = uuid();
    });

    test('is a function.', async () => {
      const app = new TailwindApp();

      assert.that(app.env).is.ofType('function');
    });

    test('returns undefined for a non-existent environment variable.', async () => {
      const app = new TailwindApp();

      assert.that(app.env(uuid())).is.undefined();
    });

    test('returns a string for a string environment variable.', async () => {
      const restore = nodeenv(environmentVariableName, 'foo');

      const app = new TailwindApp();

      assert.that(app.env(environmentVariableName)).is.equalTo('foo');
      restore();
    });

    test('returns a number for a number environment variable.', async () => {
      const restore = nodeenv(environmentVariableName, 23);

      const app = new TailwindApp();

      assert.that(app.env(environmentVariableName)).is.equalTo(23);
      restore();
    });

    test('returns a boolean for a boolean environment variable.', async () => {
      const restore = nodeenv(environmentVariableName, true);

      const app = new TailwindApp();

      assert.that(app.env(environmentVariableName)).is.true();
      restore();
    });

    test('returns an object for a valid JSON environment variable.', async () => {
      const restore = nodeenv(environmentVariableName, '{ "foo" : "bar" }');

      const app = new TailwindApp();

      assert.that(app.env(environmentVariableName)).is.equalTo({
        foo: 'bar'
      });
      restore();
    });

    test('returns a string for an invalid JSON environment variable.', async () => {
      const restore = nodeenv(environmentVariableName, '{ "foo" : "bar"');

      const app = new TailwindApp();

      assert.that(app.env(environmentVariableName)).is.equalTo('{ "foo" : "bar"');
      restore();
    });
  });

  suite('configuration', () => {
    test('is an object.', async () => {
      const app = new TailwindApp();

      assert.that(app.configuration).is.ofType('object');
    });

    test('contains the package.json file.', async () => {
      const app = new TailwindApp();

      assert.that(app.configuration.name).is.ofType('string');
      assert.that(app.configuration.version).is.ofType('string');
      assert.that(app.configuration.description).is.ofType('string');
      assert.that(app.configuration.dependencies).is.ofType('object');
    });
  });

  suite('name', () => {
    test('is a string.', async () => {
      const app = new TailwindApp();

      assert.that(app.name).is.ofType('string');
    });

    test('equals app.configuration.name.', async () => {
      const app = new TailwindApp();

      assert.that(app.name).is.equalTo(app.configuration.name);
    });
  });

  suite('version', () => {
    test('is a string.', async () => {
      const app = new TailwindApp();

      assert.that(app.version).is.ofType('string');
    });

    test('equals app.configuration.version.', async () => {
      const app = new TailwindApp();

      assert.that(app.version).is.equalTo(app.configuration.version);
    });
  });

  suite('data', () => {
    test('is a datasette.', async () => {
      const app = new TailwindApp();

      assert.that(app.data).is.ofType('object');
      assert.that(app.data.get).is.ofType('function');
      assert.that(app.data.set).is.ofType('function');
    });
  });

  suite('services', () => {
    test('is an object.', async () => {
      const app = new TailwindApp();

      assert.that(app.services).is.ofType('object');
    });

    test('has all services.', async () => {
      const app = new TailwindApp();

      assert.that(app.services.bus).is.not.undefined();
      assert.that(app.services.crypto).is.not.undefined();
      assert.that(app.services.Emitter).is.not.undefined();
      assert.that(app.services.getLogger).is.not.undefined();
      assert.that(app.services.stethoskop).is.not.undefined();
      assert.that(app.services.Timer).is.not.undefined();
    });
  });

  suite('identityProviders', () => {
    test('is an array.', async () => {
      const app = new TailwindApp({
        identityProviders: [
          {
            issuer: 'https://auth.thenativeweb.io',
            certificate: path.join(__dirname, '..', 'shared', 'keys', 'certificate.pem')
          },
          {
            issuer: 'https://auth.intuity.de',
            certificate: path.join(__dirname, '..', 'shared', 'keys', 'certificate.pem')
          }
        ]
      });

      assert.that(app.identityProviders).is.ofType('array');
      assert.that(app.identityProviders.length).is.equalTo(2);
    });

    test('contains objects that have an issuer and a certificate.', async () => {
      const app = new TailwindApp({
        identityProviders: [
          {
            issuer: 'https://auth.thenativeweb.io',
            certificate: path.join(__dirname, '..', 'shared', 'keys', 'certificate.pem')
          },
          {
            issuer: 'https://auth.intuity.de',
            certificate: path.join(__dirname, '..', 'shared', 'keys', 'certificate.pem')
          }
        ]
      });

      assert.that(app.identityProviders[0].issuer).is.equalTo('https://auth.thenativeweb.io');
      assert.that(app.identityProviders[0].certificate).is.startingWith('Certificate:');
      assert.that(app.identityProviders[1].issuer).is.equalTo('https://auth.intuity.de');
      assert.that(app.identityProviders[1].certificate).is.startingWith('Certificate:');
    });

    test('throws an exception when a certificate points to a non-existing file.', async () => {
      assert.that(() => {
        /* eslint-disable no-new */
        new TailwindApp({
          identityProviders: [
            {
              issuer: 'https://auth.thenativeweb.io',
              certificate: path.join(__dirname, '..', 'shared', 'keys', 'non-existent-certificate.pem')
            }
          ]
        });
        /* eslint-enable no-new */
      }).is.throwing(ex => ex.code === 'ENOENT');
    });
  });

  suite('Command', () => {
    test('is a function.', async () => {
      const app = new TailwindApp();

      assert.that(app.Command).is.ofType('function');
    });
  });

  suite('Event', () => {
    test('is a function.', async () => {
      const app = new TailwindApp();

      assert.that(app.Event).is.ofType('function');
    });
  });

  suite('api', () => {
    test('is an object.', async () => {
      const app = new TailwindApp();

      assert.that(app.api).is.ofType('object');
    });

    test('is an I/O Port.', async () => {
      const app = new TailwindApp();

      assert.that(app.api.incoming).is.not.undefined();
      assert.that(app.api.outgoing).is.not.undefined();
      assert.that(app.api.use).is.not.undefined();
    });
  });

  suite('commandbus', () => {
    test('is an object.', async () => {
      const app = new TailwindApp();

      assert.that(app.commandbus).is.ofType('object');
    });

    test('is an I/O Port.', async () => {
      const app = new TailwindApp();

      assert.that(app.commandbus.incoming).is.not.undefined();
      assert.that(app.commandbus.outgoing).is.not.undefined();
      assert.that(app.commandbus.use).is.not.undefined();
    });
  });

  suite('eventbus', () => {
    test('is an object.', async () => {
      const app = new TailwindApp();

      assert.that(app.eventbus).is.ofType('object');
    });

    test('is an I/O Port.', async () => {
      const app = new TailwindApp();

      assert.that(app.eventbus.incoming).is.not.undefined();
      assert.that(app.eventbus.outgoing).is.not.undefined();
      assert.that(app.eventbus.use).is.not.undefined();
    });
  });

  suite('flowbus', () => {
    test('is an object.', async () => {
      const app = new TailwindApp();

      assert.that(app.flowbus).is.ofType('object');
    });

    test('is an I/O Port.', async () => {
      const app = new TailwindApp();

      assert.that(app.flowbus.incoming).is.not.undefined();
      assert.that(app.flowbus.outgoing).is.not.undefined();
      assert.that(app.flowbus.use).is.not.undefined();
    });
  });

  suite('status', () => {
    test('is an object.', async () => {
      const app = new TailwindApp();

      assert.that(app.status).is.ofType('object');
    });

    test('is an I/O Port.', async () => {
      const app = new TailwindApp();

      assert.that(app.status.incoming).is.not.undefined();
      assert.that(app.status.outgoing).is.not.undefined();
      assert.that(app.status.use).is.not.undefined();
    });
  });

  suite('fail', () => {
    test('is a function.', async () => {
      const app = new TailwindApp();

      assert.that(app.fail).is.ofType('function');
    });
  });

  suite('exit', () => {
    test('is a function.', async () => {
      const app = new TailwindApp();

      assert.that(app.exit).is.ofType('function');
    });
  });
});
