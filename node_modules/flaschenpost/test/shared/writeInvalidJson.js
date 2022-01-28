'use strict';

const invalidJson = JSON.stringify({
  foo: 'bar'
}).slice(0, -1);

/* eslint-disable no-console */
console.log(invalidJson);
/* eslint-enable no-console */
