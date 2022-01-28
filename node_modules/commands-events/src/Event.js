'use strict';

const formats = require('formats'),
      uuid = require('uuidv4');

class Event {
  constructor ({ context, aggregate, name, metadata, type = 'domain', data = {}, custom = {}}) {
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
      throw new Error('Event name is missing.');
    }
    if (!metadata) {
      throw new Error('Metadata are missing.');
    }
    if (!metadata.correlationId) {
      throw new Error('Correlation id is missing.');
    }
    if (!metadata.causationId) {
      throw new Error('Causation id is missing.');
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
      throw new Error('Event name must be an alphanumeric string.');
    }
    if (!formats.isString(type, { minLength: 1 })) {
      throw new Error('Type must be a string.');
    }
    if (!formats.isObject(data, { isOptional: true, schema: {}, isSchemaRelaxed: true })) {
      throw new Error('Data must be an object.');
    }
    if (!formats.isObject(custom, { isOptional: true, schema: {}, isSchemaRelaxed: true })) {
      throw new Error('Custom must be an object.');
    }
    if (!formats.isObject(metadata)) {
      throw new Error('Metadata must be an object.');
    }
    if (!formats.isUuid(metadata.correlationId)) {
      throw new Error('Correlation id must be a uuid.');
    }
    if (!formats.isUuid(metadata.causationId)) {
      throw new Error('Causation id must be a uuid.');
    }
    if (metadata.isAuthorized) {
      if (!formats.isObject(metadata.isAuthorized)) {
        throw new Error('Authorization must be an object.');
      }

      if (!metadata.isAuthorized.owner) {
        throw new Error('Owner is missing.');
      }
      if (metadata.isAuthorized.forAuthenticated === undefined) {
        throw new Error('For authenticated is missing.');
      }
      if (metadata.isAuthorized.forPublic === undefined) {
        throw new Error('For public is missing.');
      }

      if (!formats.isString(metadata.isAuthorized.owner, { minLength: 1 })) {
        throw new Error('Owner must be a string.');
      }
      if (!formats.isBoolean(metadata.isAuthorized.forAuthenticated)) {
        throw new Error('For authenticated must be a boolean.');
      }
      if (!formats.isBoolean(metadata.isAuthorized.forPublic)) {
        throw new Error('For public must be a boolean.');
      }
    }

    this.context = { name: context.name };
    this.aggregate = { name: aggregate.name, id: aggregate.id };
    this.name = name;
    this.id = uuid();
    this.type = type;

    this.data = data;
    this.custom = custom;
    this.user = null;
    this.metadata = {
      timestamp: (new Date()).getTime(),
      published: false,
      correlationId: metadata.correlationId,
      causationId: metadata.causationId
    };

    if (metadata.isAuthorized) {
      this.metadata.isAuthorized = metadata.isAuthorized;
    }
  }

  addUser (user) {
    if (!user) {
      throw new Error('User is missing.');
    }
    if (!user.id) {
      throw new Error('User id is missing.');
    }

    this.user = {
      id: user.id
    };
  }
}

Event.wrap = function ({ context, aggregate, name, id, user, metadata, type, data, custom }) {
  const event = new Event({ context, aggregate, name, metadata, type, data, custom });

  event.id = id;
  event.metadata = metadata;

  if (user && user.id) {
    event.addUser(user);
  }

  if (!Event.isWellformed(event)) {
    throw new Error('Event is malformed.');
  }

  return event;
};

Event.isWellformed = function (event) {
  return formats.isObject(event, {
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
      type: formats.string({ minLength: 1 }),
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
          id: formats.string({ minLength: 1 })
        },
        isOptional: true
      }),
      metadata: formats.object({
        isSchemaRelaxed: true,
        schema: {
          timestamp: formats.number(),
          published: formats.boolean(),
          correlationId: formats.uuid(),
          causationId: formats.uuid(),
          isAuthorized: formats.object({
            isOptional: true,
            schema: {
              owner: formats.string({ minLength: 1 }),
              forAuthenticated: formats.boolean(),
              forPublic: formats.boolean()
            },
            isSchemaRelaxed: false
          })
        }
      })
    }
  });
};

module.exports = Event;
