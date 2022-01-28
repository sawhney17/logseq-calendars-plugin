'use strict';

var TailwindApp = require('./TailwindApp');

var tailwindApp;
var tailwind = {
  createApp: function createApp(options) {
    tailwindApp = new TailwindApp(options);
    return tailwindApp;
  },
  app: function app() {
    if (!tailwindApp) {
      throw new Error('Application has not been created.');
    }

    return tailwindApp;
  },
  destroyApp: function destroyApp() {
    tailwindApp = undefined;
  }
};
module.exports = tailwind;