/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

/* jshint -W030 */
/* global describe, it */

var Vars = require('../tasks/vars');
var expect = require('chai').expect;
var grunt = require('grunt');
var tmp = require('tmp');
var traverse = require('traverse');
var _ = require('lodash');

// clean up temporary files and folders even if an uncaught exception occurs
tmp.setGracefulCleanup();

describe('vars', function () {

    var count, i, keys, map, src;

    describe('module', function () {
        it('should load', function () {
            expect(Vars).not.to.be.null;
        });
        it('should have the expected number of members', function () {
            keys = Object.keys(Vars);
            expect(keys.length).to.equal(7);
        });
    });

    describe('load function', function () {
        it('should load a single JSON source', function () {
            src = ['test/fixtures/vars/json/simple.json'];
            map = Vars.load(src);
            keys = Object.keys(map);
            expect(map).to.be.an.instanceof(Object);
            expect(keys.length).to.equal(3);
        });
        it('should load multiple JSON sources', function () {
            src = [
                'test/fixtures/vars/json/strings.json',
                'test/fixtures/vars/json/objects.json'
            ];
            map = Vars.load(src);
            keys = Object.keys(map);
            expect(map).to.be.an.instanceof(Object);
            expect(keys.length).to.equal(7);
        });
        it('should load a single properties file', function () {
            src = ['test/fixtures/vars/properties/test1.properties'];
            map = Vars.load(src);
            expect(map).to.be.an.instanceof(Object);
            count = 0;
            traverse(map).forEach(function (node) {
                if (this.isLeaf) {
                    count++;
                }
            });
            expect(count).to.equal(6);
        });
        it('should load multiple properties files', function () {
            src = [
                'test/fixtures/vars/properties/test1.properties',
                'test/fixtures/vars/properties/test2.properties'
            ];
            map = Vars.load(src);
            count = 0;
            traverse(map).forEach(function (node) {
                if (this.isLeaf) {
                    count++;
                }
            });
            expect(count).to.equal(6);
        });
        it('should load a javascript file', function () {
            src = ['test/fixtures/vars/functions/func1.js'];
            for (i = 0; i < src.length; i++) {
                map = Vars.load(src[i]);
                keys = Object.keys(map);
                expect(map).to.be.an.instanceof(Object);
                expect(keys.length).to.equal(2);
            }
        });
        it('should load multiple javascript files', function () {
            src = [
                'test/fixtures/vars/functions/func1.js',
                'test/fixtures/vars/functions/func2.js'
            ];
            map = Vars.load(src);
            keys = Object.keys(map);
            expect(keys.length).to.equal(4);
        });
        it('should load json, properties, and javascript files together', function () {
            src = [
                'test/fixtures/vars/json/strings.json',
                'test/fixtures/vars/json/objects.json',
                'test/fixtures/vars/properties/test1.properties',
                'test/fixtures/vars/properties/test2.properties',
                'test/fixtures/vars/functions/func1.js',
                'test/fixtures/vars/functions/func2.js'
            ];
            map = Vars.load(src);
            keys = Object.keys(map);
            expect(keys.length).to.equal(15);
        });
    });

    describe('resolve function', function () {
        it('should resolve string references', function () {
            var subs = {
                "a": "value",
                "b": "{{a}}",
                "c": "{{a}} {{a}}"
            };
            var expected = {
                "a": "value",
                "b": "value",
                "c": "value value"
            };
            var result = Vars.resolve(subs, subs);
            var result_str = JSON.stringify(result);
            var expected_str = JSON.stringify(expected);
            expect(result_str).to.equal(expected_str);
        });
        it('should update all placeholders in the simple.json substitution map', function () {
            src = ['test/fixtures/vars/json/simple.json'];
            map = Vars.load(src);
            var map_before = _.cloneDeep(map);
            var map_after = Vars.resolve(map);
            expect(map_after).not.to.equal(map_before);
        });
        it('should throw an exception when there is a cycle in the graph', function () {
            src = ['test/fixtures/vars/json/cycle.json'];
            var f = function () {
                for (i = 0; i < src.length; i++) {
                    map = grunt.load.JSON(src[i]);
                    Vars.resolveVarsValues(map);
                }
            };
            expect(f).to.throw(Error);
        });
    });

});
