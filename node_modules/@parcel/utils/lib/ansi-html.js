"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ansiHtml = ansiHtml;

function _ansiHtmlCommunity() {
  const data = _interopRequireDefault(require("ansi-html-community"));

  _ansiHtmlCommunity = function () {
    return data;
  };

  return data;
}

var _escapeHtml = require("./escape-html");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ansiHtml(ansi) {
  return (0, _ansiHtmlCommunity().default)((0, _escapeHtml.escapeHTML)(ansi));
}