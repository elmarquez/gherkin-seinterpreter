/**
 * gherkin-seinterpreter
 * https://github.com/dmarques/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

/* jshint -W030 */
/* global describe, it */

var Feature = require('../tasks/feature');
var Lexer = require('gherkin').Lexer('en');
var Listener = require('../tasks/listener');
var expect = require('chai').expect;
var grunt = require('grunt');

describe("feature", function () {

    var data, f, i, j, keys, listener, lexer, path;

    describe("module", function () {
        it('should load', function () {
            expect(Feature).to.be.defined;
        });
        it('should have a correct member count', function () {
            keys = Object.keys(Feature);
            expect(keys.length).to.equal(11);
        });
    });

    describe('getElements function', function () {
        it('should return the list of feature elements', function () {
            path = 'test/fixtures/features/basic/basic.feature';
            f = Feature.read(path);
            data = Feature.getElements(f, Feature.FEATURE_TOKEN);
            expect(data.length).to.equal(1);
        });
        it('should return the list of scenario elements', function () {
            path = 'test/fixtures/features/basic/basic.feature';
            f = Feature.read(path);
            data = Feature.getElements(f, Feature.SCENARIO_TOKEN);
            expect(data.length).to.equal(3);
        });
        it('should return the list of step elements', function () {
            path = 'test/fixtures/features/basic/basic.feature';
            f = Feature.read(path);
            data = Feature.getElements(f, Feature.STEP_TOKEN);
            expect(data.length).to.equal(13);
        });
    });

    describe('getFeatureElement function', function () {
        it('should return a single feature element', function () {
            path = 'test/fixtures/features/basic/basic.feature';
            f = Feature.read(path);
            data = Feature.getFeatureElement(f);
            expect(data).to.be.defined;
            expect(data.name).to.be.defined;
            expect(data.description).to.be.defined;
        });
    });

    describe('getScenarios function', function () {
        it('should return a list of scenarios', function () {
            path = 'test/fixtures/features/basic/basic.feature';
            f = Feature.read(path);
            data = Feature.getScenarios(f);
            expect(data).to.be.defined;
            expect(data.length).to.equal(3);
        });
        it('should include step definitions with each scenario item', function () {
            path = 'test/fixtures/features/basic/basic.feature';
            f = Feature.read(path);
            data = Feature.getScenarios(f);
            for (i = 0; i < data.length; i++) {
                j = data[i];
                expect(j.length).to.be.above(3);
            }
        });
    });

    describe("hasUniqueScenarioNames function", function () {
        it('should return true when all scenario IDs are unique', function () {
            path = 'test/fixtures/features/basic/basic.feature';
            f = Feature.read(path);
            data = Feature.hasUniqueScenarioNames(f);
            expect(data).to.equal(true);
        });
        it('should return false when one or more scenario IDs is not unique', function () {
            path = 'test/fixtures/features/basic/basic.invalid.feature';
            function f() {
                i = Feature.read(path);
            }
            expect(f).to.throw(Error);
            // manual execution of above
            data = grunt.file.read(path);
            listener = new Listener();
            lexer = new Lexer(listener);
            lexer.scan(data);
            data = Feature.hasUniqueScenarioNames(listener);
            expect(data).to.equal(false);
        });
    });

    describe('interpolate function', function () {
        it('should interpolate the step definitions', function () {


        });
    });

    describe('read function', function () {
        it('should return the Feature object at a single path', function () {
            path = 'test/fixtures/features/basic/basic.feature';
            f = Feature.read(path);
            expect(f).to.be.defined;
            keys = Object.keys(f);
            expect(keys.length).to.equal(14);
        });
    });

});
