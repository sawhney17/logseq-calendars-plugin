# tailwind

tailwind is a base module for streaming and evented CQS applications.

## Table of contents

-   [Installation](#installation)
-   [Quick start](#quick-start)
    -   [Enable profiling](#enable-profiling)
    -   [Configuring I/O ports](#configuring-io-ports)
        -   [Configuring the API server](#configuring-the-api-server)
        -   [Configuring the command bus, the event bus, and the flow bus](#configuring-the-command-bus-the-event-bus-and-the-flow-bus)
        -   [Configuring the status server](#configuring-the-status-server)
    -   [Handling messages](#handling-messages)
        -   [Receiving incoming messages](#receiving-incoming-messages)
        -   [Sending outgoing messages](#sending-outgoing-messages)
        -   [Handling stream errors](#handling-stream-errors)
        -   [Handling disconnects](#handling-disconnects)
    -   [Getting application information](#getting-application-information)
        -   [Accessing environment variables](#accessing-environment-variables)
        -   [Handling configuration data](#handling-configuration-data)
        -   [Using services](#using-services)
        -   [Exiting an application](#exiting-an-application)
    -   [Enabling queries on the server](#enabling-queries-on-the-server)
-   [Accessing tailwind using HTTP](#accessing-tailwind-using-http)
    -   [Sending commands](#sending-commands)
    -   [Receiving events](#receiving-events)
    -   [Querying models](#querying-models)
        -   [Specifying where clauses](#specifying-where-clauses)
        -   [Specifying order by clauses](#specifying-order-by-clauses)
        -   [Specifying skip clauses](#specifying-skip-clauses)
        -   [Specifying take clauses](#specifying-take-clauses)
-   [Accessing tailwind using web sockets](#accessing-tailwind-using-web-sockets)
    -   [Sending commands](#sending-commands-1)
    -   [Receiving events](#receiving-events-1)
    -   [Querying models](#querying-models-1)
-   [Running the build](#running-the-build)
-   [License](#license)

## Installation

```shell
$ npm install tailwind
```

## Quick start

First you need to add a reference to tailwind to your application:

```javascript
const tailwind = require('tailwind');
```

Now you can create an actual application by calling the `createApp` function. Additionally, you may want to specify one or more identity providers to use. For that, provide the `identityProviders` array and add an object per identity provider. Each object has to have an `issuer` and the path to the certificate of the identity provider:

```javascript
const app = tailwind.createApp({
  identityProviders: [
    {
      issuer: 'https://auth.thenativeweb.io',
      certificate: path.join(__dirname, 'certificate.pem')
    }
  ]
});
```

Once you have done all this, whenever you need a reference to the application, just call the `app` function:

```javascript
const app = tailwind.app();
```

Basically, no matter what kind of application you create, the application's structure is always the same: First you configure some I/O ports, then you run custom configuration code, and finally you hand execution over to the `run` function that executes the actual application code.

### Enable profiling

If you want to profile your application, additionally provide the `profiling` options with the `host` and the `port` of a StatsD server:

```javascript
const app = tailwind.createApp({
  profiling: {
    host: 'localhost',
    port: 8125
  }
});
```

### Configuring I/O ports

At the moment, there are four I/O ports available, `app.api`, `app.commandbus`, `app.eventbus`, and `app.flowbus`. To use them, you need to connect them with wires to protocols and ports. For that use an I/O ports `use` function and provide a wire instance.

Currently, there are four wires available: `app.wires.api.http`, `app.wires.commandbus.amqp`, `app.wires.eventbus.amqp`, and `app.wires.flowbus.amqp`. While the first one only provides a generic `Server`, the latter ones provide a `Receiver` and a `Sender`, each.

So, basically, the syntax is as folows:

```javascript
await app.api.use(new app.wires.api.http.Server({
  // ...
}));
```

The parameters you have to hand over depend on the actual wire.

#### Configuring the API server

If you want to create an API I/O port which is based on `http` you have to use code similar to the following:

```javascript
await app.api.use(new app.wires.api.http.Server({
  port: 3000,
  corsOrigin: '*',
  writeModel: {
    network: {
      node: {
        commands: { ping: {}},
        events: { pinged: {}}
      }
    }
  },
  readModel: {
    lists: { pings: {}}
  }
}));
```

The parameters have the following meaning:

-   The `port` value defines the endpoint of the API.
-   The `corsOrigin` value can be a string or an array of strings and / or regular expressions containing the domains you want to allow to access your API. If you want your API to be accessible from everywhere, set this value to `*`.
-   The `writeModel` and `readModel` values finally describe the contexts, topics, commands, events and models of your application.

To access the API you basically have two options. You can either access the API manually by calling the appropriate routes, or you can use a ready-made client module such as [wolkenkit-client-js](https://github.com/thenativeweb/wolkenkit-client-js).

If you need to get the configuration for the client module yourself, you can access the route `/v1/configuration.json`.

If you want to check whether the API server is reachable, try to access the `/v1/ping` route.

#### Configuring the command bus, the event bus, and the flow bus

Configuring one of the other wires is a little bit simpler. All you need to do is to create a new instance of the requested wire, and set the url of a RabbitMQ instance as well as the name of the application:

```javascript
await app.commandbus.use(new app.wires.commandbus.amqp.Sender({
  url: 'amqp://admin:admin@localhost:5672',
  application: 'plcr'
}));

await app.commandbus.use(new app.wires.commandbus.amqp.Receiver({
  url: 'amqp://admin:admin@localhost:5672',
  application: 'plcr',
  prefetch: 50
}));
```

#### Configuring the status server

If you want to create a status I/O port which is based on `http` you have to use code similar to the following:

```javascript
await app.status.use(new app.wires.status.http.Server({
  port: 3000,
  corsOrigin: '*'
}));
```

The parameters have the following meaning:

-   The `port` value defines the endpoint of the status API.
-   The `corsOrigin` value can be a string or an array of strings and / or regular expressions containing the domains you want to allow to access your status API. If you want your status API to be accessible from everywhere, set this value to `*`.

### Handling messages

#### Receiving incoming messages

To handle incoming messages, you need to subscribe to the `data` event of the `incoming` stream of the appropriate I/O port. The following example shows how to listen for incoming messages from the API I/O port:

```javascript
app.api.incoming.on('data', command => {
  // ...
});
```

When you receive a message from the command bus, the event bus or the flow bus you have to call the message's `next` function to mark the message as handled:

```javascript
app.commandbus.incoming.on('data', command => {
  // ...
  command.next();
});
```

If the message could not be handled successfully, instead of `next` either call `discard` to drop the message or call `defer` to requeue it:

```javascript
app.commandbus.incoming.on('data', command => {
  // ...
  command.discard(); // or command.defer();
});
```

#### Sending outgoing messages

To send data using an I/O port, use its `outgoing` stream and call the `write` function:

```javascript
app.commandbus.outgoing.write({
  // ...
});
```

#### Handling stream errors

Each stream of an I/O port provides an `error` event that you can subscribe to. This allows you to setup custom error handling code:

```javascript
app.commandbus.outgoing.on('error', err => {
  // ...
});
```

#### Handling disconnects

Each stream of an I/O port provides a `disconnect` event that you can subscribe to. This allows you to setup custom disconnection handling code:

```javascript
app.commandbus.outgoing.on('disconnect', err => {
  // ...
});
```

### Getting application information

Besides the I/O ports, the `app` object provides a number of properties and functions you can use within your application.

-   `app.name` contains your application's name.
-   `app.version` contains your application's version.
-   `app.configuration` contains your application's `package.json` file deserialized into an object.
-   `app.dirname` contains the name of your application's root directory.
-   `app.identityProvider` contains an object that provides the identity provider's `name` and its `certificate`.

The `name` and `version` properties are read from your application's `package.json` file.

#### Accessing environment variables

If you need to access environment variables use the `app.env` function and provide the key of the environment variable you're interested in. If the environment variable is not set, `app.env` returns `undefined`, otherwise it returns its value.

If the value is a serialized JSON object, it becomes deserialized automatically, otherwise it gets returned as-is:

```javascript
const port = app.env('PORT');
// => 3000
```

#### Handling configuration data

If you need to store configuration data at runtime, use the `app.data` object which provides a ready-made [datasette](https://github.com/thenativeweb/datasette) instance.

```javascript
app.data.set('foo', 23);
app.data.get('foo'); // => 23
```

#### Using services

Additionally, the `app` object also provides a number of services that may be used by your application.

-   `app.services.bus` is a message bus, see [draht](https://github.com/thenativeweb/draht) for details. The `get` function is automaticalled called internally, so you don't have to create a new instance.
-   `app.services.crypto` provides functions for encrypting, decrypting, signing and verifying messages, see [crypto2](https://github.com/thenativeweb/crypto2) for details.
-   `app.services.Datasette` is a key-value container, see [datasette](https://github.com/thenativeweb/datasette) for details.
-   `app.services.Emitter` is an event emitter, see [draht](https://github.com/thenativeweb/draht) for details.
-   `app.services.getLogger` returns a logger, see [flaschenpost](https://github.com/thenativeweb/flaschenpost) for details.
-   `app.services.Timer` is a timer, see [timer2](https://github.com/thenativeweb/timer2) for details.

#### Exiting an application

To exit an application, call the `app.exit` function. Optionally you may specify an exit code:

```javascript
app.exit();
```

If you want to log an error and exit, use the `app.fail` function and provide a message and the error as parameter:

```javascript
app.fail('Application failed.', new Error('...'));
```

### Enabling queries on the server

To enable querying models on the server, you need to provide a function that gets the data from the model and writes them to a stream. For that use the `app.api.read` hook:

```javascript
app.api.read = async function (modelType, modelName, options) {
  // options.where
  // options.orderBy
  // options.skip
  // options.take
  // options.user
  // ...
  // return stream;
};
```

## Accessing tailwind using HTTP

### Sending commands

To send a command to tailwind, you need to send a `POST` request to the `/v1/command` route with the actual command in the request body. To create a command, see the [commands-events](https://github.com/thenativeweb/commands-events) module.

### Receiving events

To receive events from tailwind, you need to send a `POST` request to the `/v1/events` route. This then streams events to the client using the [JSON Lines](http://jsonlines.org/) format over a long-running http-connection. Inside the client, you may use the [json-lines-client](https://github.com/thenativeweb/json-lines-client) module as an easy way to request and parse events.

If you do not want to receive any event, you are also able to filter them. For this provide a filter object within the request body. Then, tailwind will only deliver events to you that match your filter object, i.e. you will get all events that contain the exact same properties and values as the filter object.

### Querying models

Clients can query models by using the `/v1/read/:modelType/:modelName` route with a `POST` request. The result is streamed to the client using a long-running http connection.

Optionally, you can send a number of query string parameters to specify a filter and similar things.

#### Specifying where clauses

The `where` value must be a stringified JSON object encoded with `encodeURIComponent`. For the object itself, use the following format:

```javascript
const where = {
  name: 'Jane Doe',
  age: { $greaterThan: 18 }
};
```

If `where` is not provided it defaults to `{}`.

#### Specifying order by clauses

The `orderBy` value must be a stringified JSON object encoded with `encodeURIComponent`. For the object itself, use the following format:

```javascript
const orderBy = {
  name: 'ascending'
};
```

If `orderBy` is not provided it defaults to `{}`.

#### Specifying skip clauses

This value must be the number of items to skip. If `skip` is not provided, it defaults to `0`.

#### Specifying take clauses

This value must be the number of items to return. If `take` is not provided, it defaults to `100`.

## Accessing tailwind using web sockets

First you need to establish a web socket connection. For this, connect to the server running the tailwind application using the `ws` protocol.

All messages that you are going to send must follow a given form. There is always a `type` property, which specifies the message type, and a `procedureId` which needs to be set to a uuid in v4 format, so that you can distinguish multiple requests from each other.

Additionally, there is a `payload` property which contains the actual data to send. If you need to send an authenticated message, you need to add the user's JWT token as an encoded string using the `token` property.

So, a typical message looks like this:

```javascript
{
  type: '...',
  procedureId: '42dabca1-6c9b-45d2-8a42-497a25f4c04b',
  payload: {
    // ...
  },
  token: '...'
}
```

As a response, you will get a similar message back. The response will always have the same `procedureId`, so that you can connect a response to its request. Additionally, responses have a `statusCode` property that acts similar to the HTTP status codes.

If there is an error, you will get back a message of type `error` with an appropriate status code, such as `401` or `500`, e.g.

### Sending commands

To send a command to tailwind, set the type to `sendCommand` and provide the actual command as `payload`. For details on how to create commands, see the [commands-events](https://github.com/thenativeweb/commands-events) module.

If sending the command succeeded, you will get a response of type `sentCommand`.

### Receiving events

To receive events from tailwind, you need to subscribe to them. For this, set the type to `subscribeEvents`. You may provide a filter as `payload`. Then, tailwind will only deliver events to you that match your filter object, i.e. you will get all events that contain the exact same properties and values as the filter object. If you do not have a filter, use an empty object instead.

If subscribing to the events succeeded, you will first get a response of type `subscribedEvents`, and then a message of type `event` for each event, with the event's data as payload.

To unsubscribe from events, send a message with type `unscubscribeEvents`. Once you are unsubscribed, you will get a response of type `unsubscribedEvents`.

### Querying models

Clients can query models by sending a message with type `subscribeRead`. You need to set the `payload` to an object that contains the `modelType`, the `modelName`, and a `query`. For details on how to structure the query, see [Querying models](#querying-models). If you don't want to provide a query, use an empty object instead.

If reading the model worked, you will first get a response of type `subscribedRead`, and then a message of type `item` for each item of the model, with the item's data as payload. Once you are done, you will receive a `finish` event.

To cancel reading a model before the `finish` event was sent, send a message with type `unsubscribeRead`. If this succeeded, you will get a response of type `unsubscribedRead`.

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```

## License

Copyright (c) 2014-2019 the native web.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see [GNU Licenses](http://www.gnu.org/licenses/).
