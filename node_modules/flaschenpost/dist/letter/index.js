'use strict';

var stream = require('stream'),
    util = require('util');

var Paragraph = require('./Paragraph');

var Transform = stream.Transform;

var Letter = function Letter(options) {
  options = options || {};
  options.objectMode = true;
  Reflect.apply(Transform, this, [options]);
  this.id = 0;
};

util.inherits(Letter, Transform);
/* eslint-disable no-underscore-dangle */

Letter.prototype._transform = function (chunk, encoding, callback) {
  /* eslint-enable no-underscore-dangle */
  var paragraph = new Paragraph(this.id, chunk);
  this.push(paragraph);
  this.id += 1;
  callback();
};

module.exports = new Letter();