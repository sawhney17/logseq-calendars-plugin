# flaschenpost

flaschenpost is a logger for cloud-based applications.

![flaschenpost](https://github.com/thenativeweb/flaschenpost/raw/master/images/logo.jpg "flaschenpost")

> *A [/ˈflaʃənˌpɔst/](https://en.wiktionary.org/wiki/Flaschenpost) is a &bdquo;message written on a scrap of paper, rolled-up and put in an empty bottle and set adrift on the ocean; traditionally, a method used by castaways to advertise their distress to the outside world&rdquo;.* (from [Wiktionary](https://en.wiktionary.org/wiki/message_in_a_bottle))

## Installation

```shell
$ npm install flaschenpost
```

## Quick start

First you need to integrate flaschenpost into your application.

```javascript
const flaschenpost = require('flaschenpost');
```

### Using a logger

Next, call the `getLogger` function to acquire a logger. If you don't provide a parameter flaschenpost identifies the caller automatically.

```javascript
const logger = flaschenpost.getLogger();
```

In rare cases you need to specify the caller manually, e.g. if you wrap flaschenpost in your own logging module. In these cases, provide `__filename` as parameter.

```javascript
const logger = flaschenpost.getLogger(__filename);
```

Then you can use the functions `fatal`, `error`, `warn`, `info` and `debug` to write log messages. Simply provide the message you want to log as a parameter.

```javascript
logger.info('App started.');
```

#### Handling meta data

If you want to provide additional meta data, provide them as an object as the second parameter.

```javascript
logger.info('App started.', { port: 3000 });
```

Please note that you may also use any other arbitrary type, as long as it can be stringified, but because the resulting log message will lack any descriptive keys, it will be less readable and harder to understand. That's why you should favor objects over other data types.

```javascript
logger.info('App started.', 3000);
```

#### Defining the log target

Unlike other loggers, flaschenpost only supports logging to the console. This is because a modern cloud-based application [never concerns itself with routing or storage of its output stream](http://12factor.net/logs).

When you are running an application using a TTY, the log messages will be written in a human-readable format. As soon as you redirect the output to a file or over the network, log messages are automatically written as JSON objects that can easily be processed by other tools.

Some log processing tools, e.g. Graylog, expect the JSON to be in a slightly different format. In these cases use the environment variable `FLASCHENPOST_FORMATTER` to set the output format you want to use. The following formats are currently supported.

Name  | Description
------|-----------------------------------
gelf  | The `GELF` format used by Graylog.
human | The default human-readable format.
json  | The default json format.
js:   | A custom format (see [Using a custom human-readable format](#using-a-custom-human-readable-format)).

*Please note that by providing `human` you can force flaschenpost to always show human-readable output, no matter whether there is a TTY or not.*

##### Using a custom human-readable format

Maybe you want to adjust the styling of the human-readable format. For that, you can provide a custom formatter. Basically, a custom formatter is nothing but a function that gets the log message as an object and returns a formatted string.

Hence, a simple implementation may look like the following code snippet.

```javascript
'use strict';

const format = function (log) {
  return `${log.level}  ${log.message}`;
};

module.exports = format;
```

To actually use a custom human-readable format, set the environment variable `FLASCHENPOST_FORMATTER` to `js:` and add the absolute path to the file that contains the `format` function. Instead of a file you may also provide the name of a module that provides the `format` function.

```shell
$ export FLASCHENPOST_FORMATTER=js:/foo/bar/myFormatter.js
$ export FLASCHENPOST_FORMATTER=js:myFormatter
```

#### Setting a custom host

By default, flaschenpost uses the current host's host name in log messages. If you want to change the host name being used, call the `use` function.

```javascript
flaschenpost.use('host', 'example.com');
```

### Enabling and disabling log levels

By default, only the log levels `fatal`, `error`, `warn` and `info` are printed to the console. If you want to change this, set the environment variable `LOG_LEVELS` to the comma-separated list of desired log levels.

```shell
$ export LOG_LEVELS=fatal,error,warn,info,debug
```

If you want to enable all log levels at once, you can provide a `*` character as value for the `LOG_LEVELS` environment variable.

```shell
$ export LOG_LEVELS=*
```

### Restricting `debug` logging

If the log level `debug` is enabled, by default this affects all modules. From time to time it may be desired to restrict debug logging to specific modules. For that, set the `LOG_DEBUG_MODULES` environment variable to a comma-separated list of the modules' names that you want to track.

```shell
$ export LOG_DEBUG_MODULES=module1,@scoped/module2
```

### Using the Express middleware

If you are writing an Express-based application and you use [morgan](https://github.com/expressjs/morgan) as logger, you can easily integrate flaschenpost into it.

For that, provide the `stream` property when setting up morgan and call the `Middleware` constructor function with the desired log level.

```javascript
app.use(morgan('combined', {
  stream: new flaschenpost.Middleware('info')
}));
```

Again, in rare cases it may be necessary to provide the file name of the caller on your own.

```javascript
app.use(morgan('combined', {
  stream: new flaschenpost.Middleware('info', __filename)
}));
```

## Processing logs

To process logs, first you need to install the flaschenpost CLI globally.

```shell
$ npm install -g flaschenpost
```

### Uncorking a flaschenpost

From time to time you may want to inspect log output that was written using the JSON formatter. To turn that into human readable output again, run `flaschenpost-uncork` and provide the messages using the standard input stream.

```shell
$ cat sample.log | flaschenpost-uncork
```

### Normalizing messages

However, this won't work when your log output does not only contain messages written by flaschenpost, but also arbitrary text. In this case, run `flaschenpost-normalize` and provide the messages using the standard input stream.

```shell
$ node sample.js | flaschenpost-normalize
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```

## License

The MIT License (MIT)
Copyright (c) 2013-2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
