# draht

draht provides process-level messaging.

![draht](https://github.com/thenativeweb/draht/raw/master/images/logo.jpg "draht")

## Installation

```shell
$ npm install draht
```

## Quick start

The first thing you need to do is to integrate draht into your application. For that add a reference to the `draht` module.

```javascript
const Draht = require('draht');
```

### Accessing the global draht

To access the global draht, you need to get the `instance` property:

```javascript
const draht = Draht.instance;
```

### Creating your own draht

If you need your own draht channel, create a new instance:

```javascript
const draht = new Draht();
```

### Using a draht

#### Emitting events

To emit an event, call the draht's `emit` function and provide the event name as well as its payload as parameters. Optionally, you may specify a callback.

```javascript
draht.emit('foo', { bar: 'baz' }, () => {
  // ...
});
```

*Please note that the `emit` function internally calls `process.nextTick` to make sure that an event is processed asynchronously.*

You can also emit namespaced events. For that, prefix the event name with the namespace name and separate them by using the expression `::`.

```javascript
draht.emit('demo::foo', { bar: 'baz' }, () => {
  // ...
});
```

#### Subscribing to events

To subscribe to an event, call the `on` function and provide the name of the event you want to subscribe to as well as an event handling function.

```javascript
draht.on('demo::foo', (evt, callback) => {
  // ...
});
```

Alternatively you may also use the `once` function to subscribe to an event and have the handler automatically removed afterwards.

```javascript
draht.once('demo::foo', (evt, callback) => {
  // ...
});
```

If you want to receive all events within a specific namespace, you can use the `*` character.

```javascript
draht.on('demo::*', (evt, callback) => {
  // ...
});
```

Nested namespaces are supported as well, but please note that when using wildcards you need to specify them for each namespace level separately. E.g., if you have events in the form `foo::bar::baz` and you would like to subscribe to any event in the `foo` namespace, use `foo::*::*`, not `foo::*`.

#### Unsubscribing from events

From time to time you need to unsubscribe from an event. For this use the `removeListener` function and provide the event name as well as the handler to remove. Please note that in this case you need to provide the very same handler instance to `removeListener` as you previously used.

```javascript
const onFoo = function (evt, callback) {
  // ...
};

draht.on('demo::foo', onFoo);
// ...
draht.removeListener('demo::foo', onFoo);
```

To remove all listeners for an event use `removeAllListeners` and provide only the event name.

```javascript
draht.removeAllListeners('demo::foo');
```

If you omit the event name, too, then all listeners for all events are unsubscribed.

```javascript
draht.removeAllListeners();
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ bot
```

## License

The MIT License (MIT)
Copyright (c) 2013-2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
