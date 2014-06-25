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
     * @param cfg Task configuration
     * @param name Test suite name or identifier
     * @param description Test suite description
     * @param cases Map of test case to commands
     * @param dest Destination path
     */
    writeTestScripts: function (cfg, name, description, cases, dest) {
        var date = new Date().toISOString(),
            filename, i, key, keys, path, s,
            testCase, testCases = [], testSuite,
            vars;
        // write each test case
        keys = Object.keys(cases);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            vars = {};
            testCase = module.exports.testCase();
            testCase._id = key;
            testCase._generated = date;
            testCase._description = cases[key].description || [];
            testCase.steps = cases[key].steps;
            // generate a file name for the test case
            vars.date = S(date).slugify().s;
            vars.id = name;
            vars.index = i;
            vars.name = key;
            vars.slug = S(name).slugify().s;
            if (cfg.testCaseFilename) {
                console.log("Using custom file name");
                filename = S(cfg.testCaseFilename).template(vars).s;
            } else {
                filename = module.exports.getTestCaseFileName(name, i.toString());
            }
            testCases.push(filename);
            // write the test case
            path = Path.join(dest, filename);
            grunt.log.debug("Writing case '%s'", path);
            grunt.file.write(path, JSON.stringify(testCase, undefined, 4));
        }
        // write the test suite file
        if (cfg.exportTestSuite) {
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
            // generate a file name for the test suite
            vars = {};
            vars.id = name;
            vars.date = S(date).slugify().s;
            if (cfg.testSuiteFilename) {
                filename = S(cfg.testSuiteFilename).template(vars).s;
            } else {
                filename = module.exports.getTestSuiteFileName(name);
            }
            // write the test suite to the output folder
            path = Path.join(dest, filename);
            grunt.log.debug("Writing suite '%s'", path);
            grunt.file.write(path, JSON.stringify(testSuite, undefined, 4));
        }
    }

};