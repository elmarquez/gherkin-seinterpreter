/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

/* jshint -W030 */
/* global afterEach, before, describe, it */

var Step = require('../tasks/step');
var Vars = require('../tasks/vars');
var expect = require('chai').expect;

describe('step', function () {

    var commands, keys, map, match, src, statement, steps, vars;

    describe('module', function () {
        it('should load', function () {
            expect(Step).not.to.be.null;
        });
        it('should have the expected number of members', function () {
            keys = Object.keys(Step);
            expect(keys.length).to.equal(6);
        });
    });

    describe('getVars function', function () {
        it('should return one matched variable', function () {
            var re = /^each step in ([\w|\W]+\b)$/gi;
            var str = 'each step in portal.path';
            var matches = Step.getVars(str, re);
            expect(matches).to.be.defined;
            expect(Array.isArray(matches)).to.be.true;
            expect(matches.length).to.equal(1);
            expect(matches[0]).to.equal('portal.path');
        });
        it('should return two matched variables', function () {
            var str = "It should match ABC and DEF";
            var re = /^It should match ([\w]+) and ([\w]+)$/i;
            var matches = Step.getVars(str, re);
            expect(matches).to.be.defined;
            expect(Array.isArray(matches)).to.be.true;
            expect(matches.length).to.equal(2);
            expect(matches[0]).to.equal('ABC');
            expect(matches[1]).to.equal('DEF');
        });
        it('should return no matches', function () {
            var str = "It should match A and B";
            var re = new RegExp("^It should not match ([\\w]+) and ([\\w]+)$", 'ig');
            var matches = Step.getVars(str, re);
            expect(matches).to.be.defined;
            expect(Array.isArray(matches)).to.be.true;
            expect(matches.length).to.equal(0);
        });
    });

    describe('load function', function () {
        it('should load a single javascript file', function () {
            src = 'test/fixtures/steps/steps1.js';
            map = Step.load(src);
            keys = Object.keys(map);
            expect(map).to.be.an.instanceof(Object);
            expect(keys.length).to.equal(5 + 1);
        });
    });

    describe('interpolate function', function () {
        it('should expand the statement into a list with a single command', function () {
            statement = "I click the portal.path link";
            steps = Step.load('test/fixtures/steps/steps1.js');
            expect(steps).to.be.defined;
            vars = Vars.load(['test/fixtures/vars/json/advanced.json']);
            expect(vars).to.be.defined;
            commands = Step.interpolate(statement, steps, vars);
            expect(commands).to.be.defined;
            expect(commands.length).to.equal(1);
        });
        it('should expand the statement into a list with multiple commands', function () {
            statement = "each step in portal.authentication.steps";
            steps = Step.load('test/fixtures/steps/steps1.js');
            vars = Vars.load(['test/fixtures/vars/json/advanced.json']);
            commands = Step.interpolate(statement, steps, vars);
            expect(commands).to.be.defined;
            expect(commands.length).to.equal(3);
        });
        it('should return an empty list of commands', function () {
            statement = "This statement will not match anything";
            steps = Step.load('test/fixtures/steps/steps1.js');
            vars = Vars.load(['test/fixtures/vars/json/advanced.json']);
            commands = Step.interpolate(statement, steps, vars);
            expect(commands).to.be.defined;
            expect(commands.length).to.equal(0);
        });
    });

    describe('match function', function () {
        afterEach(function () {
            Step = require('../tasks/step');
        });
        it('should match the statement against the specified pattern', function () {
            statement = "This is a test of the X function";
            src = 'test/fixtures/steps/steps1.js';
            steps = Step.load(src);
            expect(steps).to.be.defined;
            steps._statement_patterns = {
                "^This should not match": "A",
                "^This is a, test of the ([\\w|\\W]+) function$": "B",
                "^This is a test of the ([\\w|\\W]+) function$": "C"
            };
            match = Step.match(statement, steps);
            expect(match).to.not.equal(null);
            expect(match.fname).to.equal('C');
        });
        it("should log an error and throw an exception when it can't match a pattern", function () {
            statement = "This is a test of the X function";
            src = 'test/fixtures/steps/steps1.js';
            steps = Step.load(src);
            expect(steps).to.be.defined;
            steps._statement_patterns = {
                "^This should not match": "fName",
                "^Neither should thi$": "fName",
                "^Or even this": "fName"
            };
            match = Step.match(statement, steps);
            expect(match).to.equal(null);
        });
    });

});
