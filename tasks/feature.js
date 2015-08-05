/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

var Lexer = require('gherkin').Lexer('en');
var Listener = require('./listener');
var Path = require('path');
var S = require('string');
var Step = require('./step');
var grunt = require('grunt');
var seinterpreter = require('./seinterpreter');

/**
 * Feature
 */
module.exports = {

    EOF_TOKEN: 'eof',
    FEATURE_TOKEN: 'feature',
    SCENARIO_TOKEN: 'scenario',
    STEP_TOKEN: 'step',

    /**
     * Get the list of feature elements matching the specified token type.
     * @param feature
     * @param type
     * @returns {Array}
     */
    getElements: function (feature, type) {
        var f, i, items = [];
        for (i = 0; i < feature.records.length; i++) {
            f = feature.records[i];
            if (f.token === type) {
                items.push(f);
            }
        }
        return items;
    },

    getFeatureId: function (feature) {
        var f = module.exports.getFeatureElement(feature);
    },

    /**
     * Get the feature element from the Feature record. The nomenclature is a
     * bit confusing here as the Feature file contains a metadata element
     * called a Feature.
     * @param feature
     * @returns {*} Feature element
     */
    getFeatureElement: function (feature) {
        var elements = module.exports.getElements(feature, module.exports.FEATURE_TOKEN);
        // the feature element should be the first item in the list
        return elements.shift();
    },

    /**
     * Get a list of all scenarios and their corresponding step definitions.
     * @param feature Feature
     * @returns {Array} List of scenario definitions
     */
    getScenarios: function (feature) {
        var i, indicies = [], j,
            records = feature.records.slice(0),
            scenario, scenarios = [];
        // record the starting index of each scenario
        for (i = 0; i < records.length; i++) {
            if (records[i].token === module.exports.SCENARIO_TOKEN) {
                indicies.push(i);
            }
        }
        // copy the scenarios from the records list, from back
        // to front. the resultant scenarios list has the same
        // ordering as the records list
        for (i = indicies.length - 1; i >= 0; i--) {
            j = indicies[i];
            scenario = records.slice(j);
            // if the last step is of type eof then remove it
            if (scenario[scenario.length - 1].token === 'eof') {
                scenario.pop();
            }
            records = records.slice(0, j);
            scenarios.unshift(scenario);
        }
        return scenarios;
    },

    /**
     * Determine if scenarios have unique names. Return true if all
     * identifiers are unique, false otherwise.
     * @param feature
     */
    hasUniqueScenarioNames: function (feature) {
        var i, name, names = [], scenarios = module.exports.getScenarios(feature);
        for (i = 0; i < scenarios.length; i++) {
            name = scenarios[i][0].name;
            if (names.indexOf(name) !== -1) {
                grunt.log.error("Scenario '%s' does not have a unique name within the parent feature", name);
                return false;
            }
            names.push(name);
        }
        return true;
    },

    /**
     * Interpolate Gherkin statements into Selenium Interpreter commands.
     * Return a scenario name to command list mapping of commands.
     * @param feature Feature
     * @param steps Step definitions
     * @param vars Variable definitions
     * @returns {*} Scenario name to command array map
     */
    interpolate: function (feature, steps, vars) {
        var command, commands = {}, description, i, j, k, name,
            scenario, scenarioCommands = [],
            scenarios = module.exports.getScenarios(feature),
            statement;
        // Resolve each scenario statement into a sequence of Selenium
        // Interpreter commands
        for (i = 0; i < scenarios.length; i++) {
            scenario = scenarios[i];
            scenarioCommands = [];
            name = scenario[0].name;
            description = scenario[0].description || [];
            for (j = 1; j < scenario.length; j++) {
                statement = scenario[j];
                // find the step that corresponds with the statement
                command = Step.interpolate(statement.name, steps, vars);
                if (Array.isArray(command)) {
                    for (k = 0; k < command.length; k++) {
                        scenarioCommands.push(command[k]);
                    }
                } else {
                    scenarioCommands.push(command);
                }
            }
            commands[name] = {};
            commands[name].description = description;
            commands[name].steps = scenarioCommands;
        }
        return commands;
    },

    /**
     * Read and parse the feature file.
     * @param path
     * @returns {*}
     */
    read: function (path) {
        // read the file
        grunt.log.debug("Reading feature %s", path);
        var data = grunt.file.read(path);
        // parse the feature
        var listener = new Listener();
        var lexer = new Lexer(listener);
        lexer.scan(data);
        listener._path = path;
        // ensure that the feature is valid before returning it
        if (!module.exports.hasUniqueScenarioNames(listener)) {
            throw new Error("Feature does not have unique scenario identifiers " + path);
        }
        return listener;
    }

};
