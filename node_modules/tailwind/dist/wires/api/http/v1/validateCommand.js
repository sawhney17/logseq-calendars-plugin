'use strict';

var Command = require('commands-events').Command;

var validateCommand = function validateCommand(command, writeModel) {
  if (!Command.isWellformed(command)) {
    throw new Error('Malformed command.');
  }

  var context = writeModel[command.context.name];

  if (!context) {
    throw new Error('Unknown context name.');
  }

  var aggregate = context[command.aggregate.name];

  if (!aggregate) {
    throw new Error('Unknown aggregate name.');
  }

  if (!aggregate.commands || !aggregate.commands[command.name]) {
    throw new Error('Unknown command name.');
  }
};

module.exports = validateCommand;