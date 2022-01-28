'use strict';

var varname = module.exports = {
    camelback: camelback,
    camelcase: camelcase,
    dash: dash,
    underscore: underscore,
    split: split
};

// Convert a variable name string to camelback style
function camelback (name) {
    var parts = varname.split(name);
    return parts.shift() + titleCaseWords(parts).join('');
}

// Convert a variable name string to camelcase style
function camelcase (name) {
    var parts = varname.split(name);
    return titleCaseWords(parts).join('');
}

// Convert a variable name string to dash-separated style
function dash (name) {
    return varname.split(name).join('-');
}

// Convert a variable name string to underscore-separated style
function underscore (name) {
    return varname.split(name).join('_');
}

// Split a variable name string into parts
function split (name) {
    name = name
        .replace(/[^a-z0-9]+/gi, ' ')
        .replace(/([A-Z0-9]+)([A-Z][a-z])/g, '$1 $2')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .toLowerCase();
    return trim(name).split(/\s+/);
}

// Trim whitespace from a string
function trim (string) {
    return string.replace(/^\s+|\s+$/g, '');
}

// Convert all strings in an array to title-case
function titleCaseWords (parts) {
    var results = [];
    for (var i = 0; i < parts.length; i ++) {
        results.push(parts[i].charAt(0).toUpperCase() + parts[i].substr(1));
    }
    return results;
}
