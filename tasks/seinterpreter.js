/**
 * gherkin-seinterpreter
 * https://github.com/dmarques/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

var Path = require('path');
var S = require('string');
var grunt = require('grunt');

module.exports = {

    TEST_CASE_PREFIX: 'case-',

    TEST_SUITE_PREFIX: 'suite-',

    /**
     * Get a URL/path compatible version of the specified name.
     * @param name Name or identifier
     */
    getNiceName: function (name) {
        return S(name).slugify().s;
    },

    /**
     * Get the test case file name.
     * @param suiteId Test suite identifier
     * @param caseId Test case identifier
     * @returns String
     */
    getTestCaseFileName: function (suiteId, caseId) {
        return module.exports.getNiceName(suiteId) + "-" + caseId + ".case.json";
    },

    /**
     * Get the test suite file name.
     * @param suiteId Test suite identifier
     * @returns String
     */
    getTestSuiteFileName: function (suiteId) {
        return module.exports.getNiceName(suiteId) + ".suite.json";
    },

    /**
     * Create a default test case object.
     * @returns {{}}
     */
    testCase: function () {
        return {
            "type": "script",
            "seleniumVersion": "2",
            "formatVersion": 2,
            "steps": [],
            "data": {
                "configs": {},
                "source": "none"
            },
            "inputs": [],
            "timeoutSeconds": 60
        };
    },

    /**
     * Create a default test suite object.
     * @returns {{}}
     */
    testSuite: function () {
        return {
            "type": "suite",
            "seleniumVersion": "2",
            "formatVersion": 1,
            "scripts": []
        };
    },

    /**
     * Write the feature test suite and test cases to the specified path.
     * @param name Test suite name or identifier
     * @param description Test suite description
     * @param cases Map of test case to commands
     * @param dest Destination path
     */
    writeTestSuite: function (name, description, cases, dest) {
        var date = new Date().toISOString(),
            filename, i, key, keys, path, s,
            testCase, testCases = [], testSuite;
        // process each test case
        keys = Object.keys(cases);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            testCase = module.exports.testCase();
            testCase._id = key;
            testCase._generated = date;
            testCase._description = cases[key].description || [];
            testCase.steps = cases[key].steps;
            // write the test case
            filename = module.exports.getTestCaseFileName(name, i.toString());
            testCases.push(filename);
            path = Path.join(dest, filename);
            grunt.log.debug("Writing case '%s'", path);
            grunt.file.write(path, JSON.stringify(testCase, undefined, 4));
        }
        // test suite metadata
        testSuite = module.exports.testSuite();
        testSuite._id = name;
        testSuite._description = description.split('\n') || [];
        for (i =0; i < testSuite._description.length; i++) {
            testSuite._description[i] = S(testSuite._description[i]).trim().s;
        }
        testSuite._generated = date;
        testSuite.scripts = [];
        for (i = 0; i < testCases.length; i++) {
            s = {"where": "local", "path": testCases[i]};
            testSuite.scripts.push(s);
        }
        // write the test suite to the output folder
        filename = module.exports.getTestSuiteFileName(name);
        path = Path.join(dest, filename);
        grunt.log.debug("Writing suite '%s'", path);
        grunt.file.write(path, JSON.stringify(testSuite, undefined, 4));
    }

};