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

var expect = require('chai').expect;
var se = require('../tasks/seinterpreter');

describe('seinterpreter', function () {

    var data, keys, obj;

    describe('module', function () {
        it('should load', function () {
            expect(se).to.be.defined;
        });
        it('should have two functions', function () {
            keys = Object.keys(se);
            expect(keys.length).to.equal(8);
        });
    });

    describe('testCase function', function () {
        it('should return a new testCase object', function () {
            obj = se.testCase();
            expect(obj).to.be.defined;
            keys = Object.keys(obj);
            expect(keys.length).to.equal(7);
        });
    });

    describe('testSuite function', function () {
        it('should return a new testSuite object', function () {
            obj = se.testSuite();
            expect(obj).to.be.defined;
            keys = Object.keys(obj);
            expect(keys.length).to.equal(4);
        });
    });

    describe('getNiceName function', function () {
        it('should return a file system compatible file name', function () {
            var map = {
                'This is a Feature name': 'this-is-a-feature-name',
                'This is a Feature name (1234)': 'this-is-a-feature-name-1234'
            };
            for (var key in map) {
                data = se.getNiceName(key);
                expect(data).to.equal(map[key]);
            }
        });
    });

    describe('getTestCaseFileName function', function () {
        it('should return a file system compatible file name', function () {
            var map = {
                'Test Case 1 Name': 'test-case-1-name-0.case.json',
                'Test Case 2 Name': 'test-case-2-name-0.case.json'
            };
            for (var key in map) {
                data = se.getTestCaseFileName(key, "0");
                expect(data).to.equal(map[key]);
            }
        });
    });

    describe('getTestSuiteFileName function', function () {
        it('should return a file system compatible file name', function () {
            var map = {
                'Test Suite 1 Name': 'test-suite-1-name.suite.json',
                'Test Suite 2 Name': 'test-suite-2-name.suite.json'
            };
            for (var key in map) {
                data = se.getTestSuiteFileName(key);
                expect(data).to.equal(map[key]);
            }
        });
    });

    describe('write function', function () {
        it('should write the test case scripts', function () {

        });
        it('should write the test suite script', function () {

        });
    });


});