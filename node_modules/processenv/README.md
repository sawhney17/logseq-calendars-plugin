# processenv

processenv parses environment variables.

## Installation

```shell
$ npm install processenv
```

## Quick start

First you need to integrate processenv into your application:

```javascript
const processenv = require('processenv');
```

Then, to parse an environment variable, call the `processenv` function and provide the name of the environment variable you would like to parse:

```javascript
const port = processenv('PORT');
```

Please note that the value is automatically converted to the appropriate data type, e.g. a `number`. This also works for stringified JSON objects, in case you want to store complex configuration data inside an environment variable.

### Using default values

If you want to provide a default value, you may add it as a second parameter. This also works for booleans and all other types. If neither the environment variable nor the desired default value are set, `processenv` returns `undefined`:

```javascript
const port = processenv('PORT', 3000);
const user = processenv('USER', 'Jane Doe');
const isRoot = processenv('ROOT', true);
```

#### Using the `||` operator

Instead of providing a second parameter, you may use the `||` operator to handle default values. However, this may lead to problems with boolean values, e.g. if you want to use a default value of `true`:

```javascript
// This will always evaluate to true, no matter whether ROOT is false or true.
const isRoot = processenv('ROOT') || true;
```

The underlying problem here is that when a value of `false` is given for the environment variable, the `||` operator automatically falls back to the `true` keyword, hence the result will always be `true`.

To avoid this problem, always use the previously shown syntax using a second parameter to provide default values.

### Getting all environment variables

If you want to get all environment variables at once, omit the name and simply call `processenv`. The values will all be parsed, but you can not specify default values.

```javascript
const environmentVariables = processenv();
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```

## License

The MIT License (MIT)
Copyright (c) 2015-2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
