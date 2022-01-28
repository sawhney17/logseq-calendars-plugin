# comparejs

comparejs implements JavaScript's comparison operators the way you would expect them to be.

## Installation

```shell
$ npm install comparejs
```

## Quick Start

To use comparejs you need to reference it from your application by adding the following line:

```javascript
const cmp = require('comparejs');
```

### Features

- Supports comparison of `number`, `string`, `boolean`, `function`, `object`, `array` and `undefined`.
- Supports comparison of native data types and constructor-created data types, such as `number` and `new Number()`.
- Supports comparison of objects and arrays using deep-equal.
- Supports comparison of objects and arrays with `<`, `<=`, `>` and `>=` by handling them as subsets.
- Supports comparison of objects by structure.
- Supports comparison with `undefined` correctly, as `<=` and `>=` are problematic in plain JavaScript.
- Supports comparison in a perfectly type-safe way out-of-the-box.
- Supports comparison by equality and identity, depending on what makes sense.
- Developed using TDD and backed up by more than 930 unit tests.

### Basic usage

Now you are able to use the various comparison operators. All you need to do is access the `cmp` object and
use its functions:

<table>
  <tr><th>Operator</th><th>Alias</th><th>Description</th></tr>
  <tr><td>cmp.eq(first, second)</td><td>cmp.equal(first, second)</td><td>equal</td></tr>
  <tr><td>cmp.ne(first, second)</td><td>cmp.notEqual(first, second)</td><td>not equal</td></tr>
  <tr><td>cmp.gt(first, second)</td><td>cmp.greaterThan(first, second)</td><td>greater than</td></tr>
  <tr><td>cmp.ge(first, second)</td><td>cmp.greaterThanOrEqual(first, second)</td><td>greater than or equal</td></tr>
  <tr><td>cmp.lt(first, second)</td><td>cmp.lessThan(first, second)</td><td>less than</td></tr>
  <tr><td>cmp.le(first, second)</td><td>cmp.lessThanOrEqual(first, second)</td><td>less than or equal</td></tr>
  <tr><td>cmp.id(first, second)</td><td>cmp.identical(first, second)</td><td>identical</td></tr>
</table>

Please note that each comparison operator works on each combination of types and does what you would expect it to do.

### Structure comparison operators

For objects, there are special operators that compare by structure. Among other things, they can be used to verify objects against interfaces:

<table>
  <tr><th>Operator</th><th>Alias</th><th>Description</th></tr>
  <tr><td>cmp.eqs(first, second)</td><td>cmp.equalByStructure(first, second)</td><td>equal by structure</td></tr>
  <tr><td>cmp.nes(first, second)</td><td>cmp.notEqualByStructure(first, second)</td><td>not equal by structure</td></tr>
  <tr><td>cmp.gts(first, second)</td><td>cmp.greaterThanByStructure(first, second)</td><td>greater than by structure</td></tr>
  <tr><td>cmp.ges(first, second)</td><td>cmp.greaterThanOrEqualByStructure(first, second)</td><td>greater than or equal by structure</td></tr>
  <tr><td>cmp.lts(first, second)</td><td>cmp.lessThanByStructure(first, second)</td><td>less than by structure</td></tr>
  <tr><td>cmp.les(first, second)</td><td>cmp.lessThanOrEqualByStructure(first, second)</td><td>less than or equal by structure</td></tr>
</table>

Please note that these operators only work for objects. For any other type, they return `false`.

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ bot
```

## License

The MIT License (MIT)
Copyright (c) 2012-2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
