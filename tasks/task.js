/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

var Feature = require('./feature');
var Seinterpreter = require('./seinterpreter');
var Step = require('./step');
var Vars = require('./vars');

module.exports = function (grunt) {
    grunt.registerMultiTask('gherkin_to_seinterpreter',
        'Compile Gherkin .feature files to Selenium Interpreter .json scripts',
        function () {
            var description, element, feature, i, id, path, testcases;
            var paths = grunt.file.expandMapping(this.data.src, this.data.dest, {cwd: this.data.cwd}),
                steps = Step.load(this.data.steps),
                vars = Vars.load(this.data.vars);
            for (i = 0; i < paths.length; i++) {
                path = paths[i];
                // read the feature
                feature = Feature.read(path.src[0]);
                element = Feature.getFeatureElement(feature);
                id = element.name;
                description = element.description;
                // interpolate the Gherkin feature into an array of Selenium
                // Interpreter testcases
                testcases = Feature.interpolate(feature, steps, vars);
                // write the Selenium Interpreter test scripts to the
                // destination path
                Seinterpreter.writeTestScripts(this.data, id, description, testcases, path.dest);
            }
        });
};
