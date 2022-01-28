# formats

formats is a collection of validators.

## Installation

```shell
$ npm install formats
```

## Quick start

First you need to add a reference to formats in your application.

```javascript
const formats = require('formats');
```

### Validating values

Basically, to validate a value you need to call the appropriate function on the `formats` object, e.g. `string`. The result is a validator function that you can re-use multiple times.

```javascript
const stringValidator = formats.string();
console.log(stringValidator('foobar')); // => true
```

Some validators are customizable. For that provide an `options` object when requesting the validator.

```javascript
const stringValidator = formats.string({ minLength: 7 });
console.log(stringValidator('foobar')); // => false
```

#### Working with default values

From time to time you may be interested in the actual value instead of a boolean (or a default value in case of an invalid value). In these cases, specify the `default` option.

```javascript
const stringValidator = formats.string({ minLength: 7, default: 'formats' });
console.log(stringValidator('foobarbaz')); // => 'foobarbaz'
console.log(stringValidator('foobar'));    // => 'formats'
```

Although not explicitly described below, the `default` option is available for every validator.

### Using built-in validators

#### alphanumeric

Validates that a value is of type `string` that contains only alphanumeric characters.

##### Options

- `minLength`: Validates that a value is at least `n` characters long.
- `maxLength`: Validates that a value is at most `n` characters long.

##### Sample

```javascript
const validator = formats.alphanumeric({
  minLength: 5,
  maxLength: 23
});
```

#### boolean

Validates that a value is of type `boolean`.

##### Sample

```javascript
const validator = formats.boolean();
```

#### date

Validates that a value is of type `Date`.

##### Options

- `min`: Validates that a value is later than `n`.
- `max`: Validates that a value is earlier than `n`.

##### Sample

```javascript
const validator = formats.date({
  min: new Date(2015, 0, 1),
  max: new Date(2015, 11, 31)
});
```

#### email

Validates that a value is an email address, according to the [W3C HTML5 specification](http://www.w3.org/TR/html5/forms.html#valid-e-mail-address).

##### Sample

```javascript
const validator = formats.email();
```

#### function

Validates that a value is of type `function`.

##### Sample

```javascript
const validator = formats.function();
```

#### ip

Validates that a value is an ip address.

##### Options

- `version`: Validates that a value is a version `4` or version `6` address.

##### Sample

```javascript
const validator = formats.ip({
  version: 4
});
```

#### mac

Validates that a value is a MAC address, according to the IEEE 802 standard.

##### Sample

```javascript
const validator = formats.mac();
```

#### number

Validates that a value is of type `number`.

##### Options

- `isInteger`: Validates that a value is an integer.
- `min`: Validates that a value is at least `n`.
- `max`: Validates that a value is at most `n`.

##### Sample

```javascript
const validator = formats.number({
  isInteger: true,
  min: 5,
  max: 23
});
```

#### object

Validates that a value is of type `object`.

##### Options

- `isOptional`: Validates that a value may be `null` or `undefined`.
- `schema`: Validates that a value fulfills a schema.
- `isSchemaRelaxed`: Validates that a value may contain additional properties that are not described by the schema.

##### Sample

```javascript
const validator = formats.object({
  isOptional: false,
  schema: {
    foo: formats.number(),
    bar: formats.string()
  },
  isSchemaRelaxed: false
});
```

#### regex

Validates that a value matches a regular expression.

##### Options

- `expression`: Validates that the value matches a regular expression.

##### Sample

```javascript
const validator = formats.regex({
  expression: /^foo$/
});
```

#### string

Validates that a value is of type `string`.

##### Options

- `minLength`: Validates that a value is at least `n` characters long.
- `maxLength`: Validates that a value is at most `n` characters long.

##### Sample

```javascript
const validator = formats.string({
  minLength: 5,
  maxLength: 23
});
```

#### uuid

Validates that a value is a uuid.

##### Sample

```javascript
const validator = formats.uuid();
```

### Using custom validators

If you want to validate a value, but there is no matching built-in validator, you may use a custom validator.

A custom validator is a function that returns a validator function that returns `true` if the specified value is valid, and `false` otherwise (or the value and the default value, respectively, if the `default` option is given). Once you have defined the custom validator, you can use it by providing it to the `custom` function.

Additionally, it is advised to protect against unknown properties to avoid typos when creating the validators. For this, use `throwOnUnknownProperties`.

```javascript
const getReturnValue = require('formats').getReturnValue,
    throwOnUnknownProperties = require('formats').throwOnUnknownProperties;

const range = function (options) {
  options = options || {};
  options.min = options.min || Number.NEGATIVE_INFINITY;
  options.max = options.max || Number.POSITIVE_INFINITY;

  throwOnUnknownProperties(options, [ 'min', 'max', 'default' ]);

  return function (value) {
    const returnValue = getReturnValue(value, options);

    if (typeof value !== 'number') {
      return returnValue.false;
    }

    if (value < options.min) {
      return returnValue.false;
    }

    if (value > options.max) {
      return returnValue.false;
    }

    return returnValue.true;
  };
};

const rangeValidator = formats.custom(range({ min: 5, max: 23 }));
console.log(rangeValidator(42)); // => false
```

### Using is* validator functions

If you directly want to validate a value and skip the creation of a validator function, use the appropriate `is*` function, e.g. `isString`. These functions take the value as first parameter, and options as second.

```javascript
console.log(formats.isString('foobar', { minLength: 7 })); // => false
```

You may also use the `default` option as described above with the is* validator functions.

```javascript
console.log(formats.isString('foobarbaz', {
  minLength: 7,
  default: 'formats'
})); // => 'foobarbaz'

console.log(formats.isString('foobar', {
  minLength: 7,
  default: 'formats'
})); // => 'formats'
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ bot
```

## License

The MIT License (MIT)
Copyright (c) 2014-2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
