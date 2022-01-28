'use strict';

const stream = require('stream'),
      util = require('util');

const Paragraph = require('./Paragraph');

const Transform = stream.Transform;

const Letter = function (options) {
  options = options || {};
  options.objectMode = true;

  Reflect.apply(Transform, this, [ options ]);

  this.id = 0;
};

util.inherits(Letter, Transform);

/* eslint-disable no-underscore-dangle */
Letter.prototype._transform = function (chunk, encoding, callback) {
/* eslint-enable no-underscore-dangle */
  const paragraph = new Paragraph(this.id, chunk);

  this.push(paragraph);

  this.id += 1;
  callback();
};

module.exports = new Letter();
