'use strict';

const assert = require('assertthat');

const tailwind = require('../../src/tailwind');

suite('tailwind', () => {
  suiteSetup(() => {
    tailwind.destroyApp();
  });

  test('is an object.', async () => {
    assert.that(tailwind).is.ofType('object');
  });

  suite('app', () => {
    test('is a function.', async () => {
      assert.that(tailwind.app).is.ofType('function');
    });

    test('throws an exception if no app has been defined yet.', async () => {
      assert.that(() => {
        tailwind.app();
      }).is.throwing();
    });

    test('returns the application once it has been defined.', async () => {
      tailwind.createApp();

      const app = tailwind.app();

      assert.that(app).is.ofType('object');
    });

    test('returns the same application when called multiple times.', async () => {
      tailwind.createApp();

      const firstApp = tailwind.app(),
            secondApp = tailwind.app();

      assert.that(firstApp).is.sameAs(secondApp);
    });

    test('returns a new application when createApp was called in between.', async () => {
      tailwind.createApp();

      const firstApp = tailwind.app();

      tailwind.createApp();

      const secondApp = tailwind.app();

      assert.that(firstApp).is.not.sameAs(secondApp);
    });
  });

  suite('createApp', () => {
    test('is a function.', async () => {
      assert.that(tailwind.createApp).is.ofType('function');
    });

    test('returns the application.', async () => {
      const app = tailwind.createApp();

      assert.that(app).is.ofType('object');
    });
  });

  suite('destroyApp', () => {
    test('is a function.', async () => {
      assert.that(tailwind.destroyApp).is.ofType('function');
    });

    test('destroy an existing application.', async () => {
      tailwind.createApp();
      tailwind.destroyApp();

      assert.that(() => {
        tailwind.app();
      }).is.throwing('Application has not been created.');
    });
  });
});
