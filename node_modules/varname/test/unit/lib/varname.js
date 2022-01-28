// jshint maxstatements: false
// jscs:disable disallowMultipleVarDecl, maximumLineLength
'use strict';

var assert = require('proclaim');
var sinon = require('sinon');

describe('lib/varname', function () {
    var varname;

    beforeEach(function () {
        varname = require('../../../lib/varname');
    });

    it('should be an object', function () {
        assert.isObject(varname);
    });

    it('should have a `camelback` method', function () {
        assert.isFunction(varname.camelback);
    });

    describe('.camelback()', function () {
        var result;

        beforeEach(function () {
            varname.split = sinon.stub().withArgs('foo-bar-baz').returns([
                'foo',
                'bar',
                'baz'
            ]);
            result = varname.camelback('foo-bar-baz');
        });

        it('should call `varname.split` on the input', function () {
            assert.calledOnce(varname.split);
            assert.calledWithExactly(varname.split, 'foo-bar-baz');
        });

        it('should join and return the result of the split in camelback style', function () {
            assert.strictEqual(result, 'fooBarBaz');
        });

    });

    it('should have a `camelcase` method', function () {
        assert.isFunction(varname.camelcase);
    });

    describe('.camelcase()', function () {
        var result;

        beforeEach(function () {
            varname.split = sinon.stub().withArgs('foo-bar-baz').returns([
                'foo',
                'bar',
                'baz'
            ]);
            result = varname.camelcase('foo-bar-baz');
        });

        it('should call `varname.split` on the input', function () {
            assert.calledOnce(varname.split);
            assert.calledWithExactly(varname.split, 'foo-bar-baz');
        });

        it('should join and return the result of the split in camelcase style', function () {
            assert.strictEqual(result, 'FooBarBaz');
        });

    });

    it('should have a `dash` method', function () {
        assert.isFunction(varname.dash);
    });

    describe('.dash()', function () {
        var result;

        beforeEach(function () {
            varname.split = sinon.stub().withArgs('foo-bar-baz').returns([
                'foo',
                'bar',
                'baz'
            ]);
            result = varname.dash('foo-bar-baz');
        });

        it('should call `varname.split` on the input', function () {
            assert.calledOnce(varname.split);
            assert.calledWithExactly(varname.split, 'foo-bar-baz');
        });

        it('should join and return the result of the split in dashed style', function () {
            assert.strictEqual(result, 'foo-bar-baz');
        });

    });

    it('should have an `underscore` method', function () {
        assert.isFunction(varname.underscore);
    });

    describe('.underscore()', function () {
        var result;

        beforeEach(function () {
            varname.split = sinon.stub().withArgs('foo-bar-baz').returns([
                'foo',
                'bar',
                'baz'
            ]);
            result = varname.underscore('foo-bar-baz');
        });

        it('should call `varname.split` on the input', function () {
            assert.calledOnce(varname.split);
            assert.calledWithExactly(varname.split, 'foo-bar-baz');
        });

        it('should join and return the result of the split in underscored style', function () {
            assert.strictEqual(result, 'foo_bar_baz');
        });

    });

    it('should have a `split` method', function () {
        assert.isFunction(varname.split);
    });

    describe('.split()', function () {
        var expected = [
            'foo',
            'bar',
            'baz'
        ];

        it('should return an array', function () {
            assert.isArray(varname.split('foo-bar-baz'));
        });

        it('should split camelback style variable names', function () {
            assert.deepEqual(varname.split('fooBarBaz'), expected);
        });

        it('should split camelcase style variable names', function () {
            assert.deepEqual(varname.split('FooBarBaz'), expected);
        });

        it('should split dash style variable names', function () {
            assert.deepEqual(varname.split('foo-bar-baz'), expected);
        });

        it('should split underscore style variable names', function () {
            assert.deepEqual(varname.split('foo_bar_baz'), expected);
        });

        it('should split non-standard names correctly', function () {
            assert.deepEqual(varname.split('/foo/bar/baz!'), expected);
            assert.deepEqual(varname.split('FOO BAR BAZ'), expected);
            assert.deepEqual(varname.split('foo_-_bar_-_baz'), expected);
            assert.deepEqual(varname.split('foo__bar--baz'), expected);
            assert.deepEqual(varname.split('foo.bar.baz'), expected);
            assert.deepEqual(varname.split('♥/foo|bar|baz/♥'), expected);
            assert.deepEqual(varname.split('FOOBarBAZ'), expected);
        });

        it('should split names containing numbers correctly', function () {
            assert.deepEqual(varname.split('foo12Bar34Baz56'), [
                'foo12',
                'bar34',
                'baz56'
            ]);
        });

    });

});
