# datasette

datasette is a key-value container for arbitrary data.

## Installation

```shell
$ npm install datasette
```

## Quick start

The first thing you need to do is to integrate datasette into your application. For that add a reference to the `datasette` module:

```javascript
const Datasette = require('datasette');
```

Next, you can create a new data container:

```javascript
const datasette = new Datasette();
```

### Setting data

To set data, call the data container's `set` function and specify the `key` and the `value` you want to store:

```javascript
datasette.set('foo', { bar: 'baz' });
```

To set multiple keys and values at once, you can also hand over an object that contains the data:

```javascript
datasette.set({
  foo: 23,
  bar: 42
});
```

This is equivalent to calling `set` two times with separate key value pairs.

### Getting data

To get data, call the data container's `get` function and specify the `key` you would like to retrieve:

```javascript
const value = datasette.get('foo');
```

*Note: Each time you call `get`, you will get a cloned result to avoid conflicting state changes on a shared reference.*

### Dealing with events

Every time a value is created, changed or deleted, the data container will emit a `changed` event. Use the `on` or `once` functions to subscribe to this event:

```javascript
datasette.on('changed', (key, value) => {
  // ...
});
```

If you are only interested in `changed` events for a specific `key`, subscribe to the `changed::*` event instead:

```javascript
datasette.on('changed::foo', value => {
  // ...
});
```

*Note: If you set the same key value pair two times, the data container will not emit an event on the second `set` call.*

To unsubscribe from event notifications, use the `off` function.

### Suppressing events

If you don't want a `set` call to result in an emitted event, you can specify an `options` object and set its `silent` property to `true`:

```javascript
datasette.set('foo', 'bar', { silent: true });
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
