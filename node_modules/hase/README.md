# hase

hase handles exchanges and queues on RabbitMQ.

![hase](https://github.com/thenativeweb/hase/raw/master/images/logo.jpg "hase")

## Installation

```shell
$ npm install hase
```

## Quick start

First you need to add a reference to hase in your application.

```javascript
const hase = require('hase');
```

Then you need to connect to a RabbitMQ instance by calling the `connect` function and providing the instance's url.

```javascript
const mq = await hase.connect({ url: 'amqp://...' });
```

By default hase will only prefetch one message at a time. If you want to increase the prefetch size use the `prefetch` option.

```javascript
const mq = await hase.connect({
  url: 'amqp://...',
  prefetch: 64
});
```

If something goes wrong, an error is emitted on the `mq` object. So you should subscribe to the `error` event.

```javascript
const mq = await hase.connect({ url: 'amqp://...' });

mq.once('error', err => {
  // ...
});
```

Additionally, if you want to get informed when hase becomes disconnected, subscribe to the `disconnect` event.

```javascript
const mq = await hase.connect({ url: 'amqp://...' });

mq.once('disconnect', err => {
  // ...
});
```

### Using workers

A worker is a combination of a single exchange with a single queue that shares its load across multiple nodes. For that, call the `worker` function and specify a name.

```javascript
const mq = await hase.connect({ url: 'amqp://...' });

mq.once('error', err => {
  // ...
});

const worker = mq.worker('test');
```

To publish messages to this worker, call the `createWriteStream` function, and then use the `write` function of the stream that is returned.

```javascript
const mq = await hase.connect({ url: 'amqp://...' });

mq.once('error', err => {
  // ...
});

const stream = await mq.worker('test').createWriteStream();

stream.write({ foo: 'bar' });
```

To subscribe to messages received by this worker, call the `createReadStream` function, and then subscribe to the stream's `data` event. You can access the message's payload through its `payload` property.

Additionally, you need to process the received message. If you were able to successfully handle the message, call the `next` function. If not, either call `discard` (which removes the message), or call `defer` (which requeues the message).

```javascript
const mq = await hase.connect({ url: 'amqp://...' });

mq.once('error', err => {
  // ...
});

const stream = await mq.worker('test').createReadStream();

stream.on('data', message => {
  // ...
  message.next(); // or message.discard(); or message.defer();
});
```

### Using publishers

A publisher is a combination of a single exchange with multiple queues where each queue receives all messages. For that, call the `publisher` function and specify a name.

```javascript
const mq = await hase.connect({ url: 'amqp://...' });

mq.once('error', err => {
  // ...
});

const publisher = mq.publisher('test');
```

To publish messages to this publisher, call the `createWriteStream` function, and then use the `write` function of the stream that is returned.

```javascript
const mq = await hase.connect({ url: 'amqp://...' });

mq.once('error', err => {
  // ...
});

const stream = await mq.publisher('test').createWriteStream();

stream.write({ foo: 'bar' });
```

To subscribe to messages received by this publisher, call the `createReadStream` function, and then subscribe to the stream's `data` event. You can access the message's payload through its `payload` property.

Additionally, you need to process the received message. If you were able to successfully handle the message, call the `next` function. If not, either call `discard` (which removes the message), or call `defer` (which requeues the message).

```javascript
const mq = await hase.connect({ url: 'amqp://...' });

mq.once('error', err => {
  // ...
});

const stream = await mq.publisher('test').createReadStream();

stream.on('data', message => {
  // ...
  message.next(); // or message.discard(); or message.defer();
};
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```

## License

The MIT License (MIT)
Copyright (c) 2014-2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
