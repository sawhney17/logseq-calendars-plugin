# json-lines

json-lines streams JSON Lines.

## Installation

```shell
$ npm install json-lines
```

## Quick start

First you need to add a reference to json-lines in your application.

```javascript
const jsonLines = require('json-lines');
```

To send JSON you need an Express application and a route that you want to use. Please note that for technical reasons json-lines only works with `POST` routes.

Then subscribe to the `connect` and `disconnect` events to initialize or end data transfer.

```javascript
app.post('/events', jsonLines(client => {
  client.once('connect', () => {
    // ...
  });

  client.once('disconnect', () => {
    // ...
  });
}));
```

Within the `connect` event handler, you can use the `send` function to actually stream data to the client.

```javascript
client.send({
  foo: 'bar'
});
```

If you want to close the connection to the client, call the `disconnect` function. This will emit the `disconnect` event and clean up any event listeners.

```javascript
client.disconnect();
```

### Parsing the request body

From time to time you may want to send a request body to the json-lines route, e.g. to provide a configuration object. On the server, you can access the request's body using the `req.body` property of the `client` object.

In order to do so you *must* add the [body-parser middleware](https://www.npmjs.com/package/body-parser) to your application, before adding the route itself.

```javascript
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/events', jsonLines(client => {
  console.log(client.req.body);
  // => {
  //      foo: 'bar'
  //    }
}));
```

### Using the client module

To connect to a json-lines enabled server, use the [json-lines-client](https://www.npmjs.com/package/json-lines-client) module.

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
