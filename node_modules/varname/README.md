
Varname
=======

Convert strings between different variable naming formats.

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![Build status][shield-build]][info-build]
[![Code coverage][shield-coverage]][info-coverage]
[![MIT licensed][shield-license]][info-license]


Getting Started
---------------

You can use Varname on the server side with [Node.js][node] and npm:

```sh
npm install varname
```

On the client side, you can include the built version of Varname in your page (found in [build/varname.js](build/varname.js)):

```html
<script src="varname.js"></script>
```


Usage
-----

In Node.js you can include Varname in your script by using require:

```js
var varname = require('varname');
```

If you're just including with a `<script>`, `varname` is available as a global variable.


### varname.camelback( name )

Convert a variable name to camelBack format (capitalize the first letter of all but the first word).  
**name:** *(string)* The variable name to convert.  
**return:** *(string)* Returns the converted variable name.

```js
varname.camelback('foo_bar_baz'); // 'fooBarBaz'
```


### varname.camelcase( name )

Convert a variable name to CamelCase format (capitalize the first letter of each word).  
**name:** *(string)* The variable name to convert.  
**return:** *(string)* Returns the converted variable name.

```js
varname.camelcase('foo_bar_baz'); // 'FooBarBaz'
```


### varname.dash( name )

Convert a variable name to dash format.  
**name:** *(string)* The variable name to convert.  
**return:** *(string)* Returns the converted variable name.

```js
varname.dash('FooBarBaz'); // 'foo-bar-baz'
```


### varname.underscore( name )

Convert a variable name to underscore format.  
**name:** *(string)* The variable name to convert.  
**return:** *(string)* Returns the converted variable name.

```js
varname.underscore('FooBarBaz'); // 'foo_bar_baz'
```


### varname.split( name )

Split a string into separate variable parts. This allows you to write your own format converters easily.
**name:** *(string)* The variable name to split.  
**return:** *(array)* Returns an array of parts.

```js
varname.split('fooBarBaz');
varname.split('FooBarBaz');
varname.split('FOOBarBAZ');
varname.split('foo-bar-baz');
varname.split('foo_bar_baz');
varname.split('♥~foo|bar|baz~♥');
// all return ['foo', 'bar', 'baz']
```


Browser Support
---------------

Varname is officially supported in the following browsers:

  - Android Browser 2.2+
  - Edge 0.11+
  - Firefox 4+
  - Google Chrome 14+
  - Internet Explorer 6+
  - Safari 5+
  - Safari iOS 4+


Contributing
------------

To contribute to Varname, clone this repo locally and commit your code on a separate branch.

If you're making core library changes please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
make ci
```


License
-------

Varname is licensed under the [MIT][info-license] license.  
Copyright &copy; 2015, Rowan Manning



[make]: http://gnuwin32.sourceforge.net/packages/make.htm
[node]: http://nodejs.org/

[info-coverage]: https://coveralls.io/github/rowanmanning/varname
[info-license]: LICENSE
[info-node]: package.json
[info-npm]: https://www.npmjs.com/package/varname
[info-build]: https://travis-ci.org/rowanmanning/varname
[shield-coverage]: https://img.shields.io/coveralls/rowanmanning/varname.svg
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/badge/node.js%20support-0.10–7-brightgreen.svg
[shield-npm]: https://img.shields.io/npm/v/varname.svg
[shield-build]: https://img.shields.io/travis/rowanmanning/varname/master.svg
