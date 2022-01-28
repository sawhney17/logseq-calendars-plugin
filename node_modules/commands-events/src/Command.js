'use strict';

const formats = require('formats'),
      uuid = require('uuidv4');

class Command {
  constructor ({ context, aggregate, name, data = {}, custom = {}}) {
    if (!context) {
      throw new Error('Context is missing.');
    }
    if (!context.name) {
      throw new Error('Context name is missing.');
    }
    if (!aggregate) {
      throw new Error('Aggregate is missing.');
    }
    if (!aggregate.name) {
      throw new Error('Aggregate name is missing.');
    }
    if (!aggregate.id) {
      throw new Error('Aggregate id is missing.');
    }
    if (!name) {
      throw new Error('Command name is missing.');
    }

    if (!formats.isObject(context)) {
      throw new Error('Context must be an object.');
    }
    if (!formats.isAlphanumeric(context.name, { minLength: 1 })) {
      throw new Error('Context name must be an alphanumeric string.');
    }
    if (!formats.isObject(aggregate)) {
      throw new Error('Aggregate must be an object.');
    }
    if (!formats.isAlphanumeric(aggregate.name, { minLength: 1 })) {
      throw new Error('Aggregate name must be an alphanumeric string.');
    }
    if (!formats.isUuid(aggregate.id)) {
      throw new Error('Aggregate id must be a uuid.');
    }
    if (!formats.isAlphanumeric(name, { minLength: 1 })) {
      throw new Error('Command name must be an alphanumeric string.');
    }
    if (!formats.isObject(data)) {
      throw new Error('Data must be an object.');
    }
    if (!formats.isObject(custom)) {
      throw new Error('Custom must be an object.');
    }

    this.context = { name: context.name };
    this.aggregate = { name: aggregate.name, id: aggregate.id };
    this.name = name;
    this.id = uuid();

    this.data = data;
    this.custom = custom;
    this.user = null;
    this.metadata = {
      timestamp: Date.now(),
      correlationId: this.id,
      causationId: this.id
    };
  }

  addToken (token) {
    if (!token) {
      throw new Error('Token is missing.');
    }
    if (!token.sub) {
      throw new Error('Sub claim is missing.');
    }

    this.user = {
      id: token.sub,
      token
    };
  }
}

Command.wrap = function ({ context, aggregate, name, id, metadata, user, data = {}, custom = {}}) {
  const command = new Command({ context, aggregate, name, data, custom });

  command.id = id;
  command.metadata.timestamp = metadata.timestamp;
  command.metadata.correlationId = metadata.correlationId;
  command.metadata.causationId = metadata.causationId;

  if (user && user.token) {
    command.addToken(user.token);
  }

  if (!Command.isWellformed(command)) {
    throw new Error('Command is malformed.');
  }

  return command;
};

Command.isWellformed = function (command) {
  return formats.isObject(command, {
    schema: {
      context: formats.object({
        schema: {
          name: formats.alphanumeric({ minLength: 1 })
        }
      }),
      aggregate: formats.object({
        schema: {
          name: formats.alphanumeric({ minLength: 1 }),
          id: formats.uuid()
        }
      }),
      name: formats.alphanumeric({ minLength: 1 }),
      id: formats.uuid(),
      data: formats.object({
        schema: {},
        isSchemaRelaxed: true
      }),
      custom: formats.object({
        schema: {},
        isSchemaRelaxed: true
      }),
      user: formats.object({
        schema: {
          id: formats.string({ minLength: 1 }),
          token: formats.object({
            schema: {
              sub: formats.string({ minLength: 1 })
            },
            isSchemaRelaxed: true
          })
        },
        isOptional: true
      }),
      metadata: formats.object({
        schema: {
          timestamp: formats.number(),
          correlationId: formats.uuid(),
          causationId: formats.uuid()
        }
      })
    }
  });
};

module.exports = Command;
