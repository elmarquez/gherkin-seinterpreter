/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

var Path = require('path');
var S = require('string');
var grunt = require('grunt');
var properties = require('./properties');

module.exports = {

    // list of loaded step modules where the key is the module file path and
    // the value is a reference to the loaded module object
    _step_modules: {},

    // a regex pattern to function name map that will help us determine which
    // step function should be executed for a given gherkin statement
    _statement_patterns: {},

    /**
     * Get a list of match groups from the string.
     * @param str String
     * @param re RegExp object
     * @returns {Array} List of match groups
     */
    getVars: function (str, re) {
        var matches = [];
        var match = re.exec(str);
        if (Array.isArray(match)) {
            for (var i = 1; i < match.length; i++) {
                matches.push(match[i]);
            }
        }
        return matches;
    },

    /**
     * Interpolate the statement into a Selenium Interpreter command.
     * @param statement Gherkin statement
     * @param steps Step definitions map
     * @param defs Variable definitions map
     * @returns {Array} Selenium Interpreter commands
     */
    interpolate: function (statement, steps, defs) {
        var command = [],
            match = module.exports.match(statement, steps),
            vars = [];
        if (match && steps.hasOwnProperty(match.fname)) {
            vars = module.exports.getVars(statement, match.regexp);
            command = steps[match.fname](vars, defs);
        }
        return command;
    },

    /**
     * Load step definitions from the specified source.
     * @param src Path to step definition file.
     * @returns {*} Map of step definitions.
     */
    load: function (src) {
        var steps, path = S(src);
        if (path.endsWith('.js')) {
            path = Path.join(process.cwd(), path.s);
            grunt.log.debug("Loading step definitions from '%s'", path);
            steps = require(path);
            return steps;
        }
        grunt.log.error('Not a valid step definition module %s', path.s);
        return {};
    },

    /**
     * Find the regexp pattern that matches the specified statement. Return the
     * name of the matched function or null if there are no matches.
     * @param statement Gherkin statement
     * @param steps Step definitions
     * @returns {*} Object with the matching function name, match pattern,
     * regexp, and source statement
     * @todo not sure why but 'statement' is being injected as an object
     * instead of a string so I've had to cast it here
     */
    match: function (statement, steps) {
        var i, pattern,
            patterns = Object.keys(steps._statement_patterns),
            reg, result,
            s = S(statement).s;
        for (i = 0; i < patterns.length; i++) {
            pattern = patterns[i];
            reg = new RegExp(pattern, 'i');
            if (s.search(reg) !== -1) {
                grunt.log.debug("Statement '%s' matched step pattern '%s'", statement, pattern);
                result = {
                    fname: steps._statement_patterns[pattern],
                    pattern: pattern,
                    regexp: reg,
                    statement: s
                };
                return result;
            }
        }
        grunt.log.error("Statement '%s' did not match any step patterns", statement);
        return null;
    }

};
