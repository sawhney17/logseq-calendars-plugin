# stethoskop

stethoskop measures application fitness.

## Installation

```shell
$ npm install stethoskop
```

## Quick Start

First you need to add a reference to this module.

```javascript
const Stethoskop = require('stethoskop');
```

Then, create an instance by calling the constructor and providing the connection to a [StatsD](https://github.com/etsy/statsd) server. Apart from that, you need to provide the name of your application.

```javascript
const stethoskop = new Stethoskop({
  from: {
    application: 'myapp'
  },
  to: {
    host: 'localhost',
    port: 8125
  },
  enabled: true
});
```

If you set the `enabled` property to `false`, the module won't do anything. You may want to control this option using an environment variable to dynamically enable or disable profiling.

### Taking notes

Now you can note values by calling the `noteValue` function with a key and a value.

```javascript
stethoskop.noteValue('foo', 23);
```

### Watching the system

Apart from that, cpu and memory usage are being watched and noted automatically once per minute.

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ bot
```

## License

The MIT License (MIT)
Copyright (c) 2015-2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
