'use strict';

const TailwindApp = require('./TailwindApp');

let tailwindApp;

const tailwind = {
  createApp (options) {
    tailwindApp = new TailwindApp(options);

    return tailwindApp;
  },

  app () {
    if (!tailwindApp) {
      throw new Error('Application has not been created.');
    }

    return tailwindApp;
  },

  destroyApp () {
    tailwindApp = undefined;
  }
};

module.exports = tailwind;
