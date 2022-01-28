'use strict';

const Command = require('commands-events').Command;

const validateCommand = function (command, writeModel) {
  if (!Command.isWellformed(command)) {
    throw new Error('Malformed command.');
  }

  const context = writeModel[command.context.name];

  if (!context) {
    throw new Error('Unknown context name.');
  }

  const aggregate = context[command.aggregate.name];

  if (!aggregate) {
    throw new Error('Unknown aggregate name.');
  }

  if (!aggregate.commands || !aggregate.commands[command.name]) {
    throw new Error('Unknown command name.');
  }
};

module.exports = validateCommand;
