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
    /**
     * Compile a collection of Gherkin .feature files into Selenium Interpreter
     * executable scripts.
     */
    grunt.registerMultiTask('gherkin_to_seinterpreter',
        'Compile Gherkin .feature files to Selenium Interpreter .json scripts',
        function () {
            var description, element, feature, i, name, path,
                paths = grunt.file.expandMapping(this.data.src, this.data.dest, {cwd: this.data.cwd}),
                steps = Step.load(this.data.steps),
                suite,
                vars = Vars.load(this.data.vars);
            for (i = 0; i < paths.length; i++) {
                path = paths[i];
                // read the feature
                feature = Feature.read(path.src[0]);
                element = Feature.getFeatureElement(feature);
                name = element.name;
                description = element.description;
                // interpolate feature into Selenium Interpreter test suite
                suite = Feature.interpolate(feature, steps, vars);
                // write the Selenium Interpreter suite to the destination path
                Seinterpreter.writeTestSuite(name, description, suite, path.dest);
            }
        });
};
