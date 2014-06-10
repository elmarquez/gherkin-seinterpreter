/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

var Properties = require('tea-properties');
var grunt = require('grunt');

/**
 * Step definitions
 *
 * Feature files specify a series of actions and conditions that must succeed
 * for a test scenario to be considered successful. To execute these tests
 * through Selenium Interpreter, each Gherkin statement must be interpolated
 * into an equivalent set of Selenium Interpreter steps or command(s).
 */
module.exports = {

    /**
     * A map of statement pattern to the name of the function used to handle a
     * particular Gherkin statement.
     */
    _statement_patterns: {
        '^each step in ([\\w|\\W]+)$': 'each_step_in_x',
        '^I click the ([\\w|\\W]+)$': 'i_click_the_x',
        '^I click the ([\\w|\\W]+) link$': 'i_click_the_x_link',
        '^I enter ([\\w|\\W]+) in the ([\\w|\\W]+)$': 'i_enter_x_in_the_y',
        '^I navigate to ([\\w|\\W]+)$': 'i_navigate_to_x'
    },

    /**
     * The user executes each step in the command sequence X.
     * @param vars Variables
     * @param defs Variable definitions
     */
    each_step_in_x: function (vars, defs) {
        var key = vars[0];
        var steps = Properties.get(defs, key);
        if (!steps) {
            console.log("Could not find definition for %s", key);
        }
        return steps;
    },

    /**
     * The user clicks the page element X.
     * @param vars Variables
     * @param defs Variable definitions
     */
    i_click_the_x: function (vars, defs) {
        var anchor_id = vars[0];
        var anchor_xpath = Properties.get(defs, anchor_id);
        var command = {
            "type": "clickElement",
            "locator": {
                "type": "id",
                "value": anchor_xpath
            }
        };
        return [ command ];
    },

    /**
     * The user clicks the X anchor.
     * @param vars Variables
     * @param defs Variable definitions
     */
    i_click_the_x_link: function (vars, defs) {
        var anchor_id = vars[0];
        var anchor_xpath = Properties.get(defs, anchor_id);
        var command = {
            "type": "clickElement",
            "locator": {
                "type": "id",
                "value": anchor_xpath
            }
        };
        return [ command ];
    },

    /**
     * The user enters a text value X into a text input Y.
     * @param vars Variables
     * @param defs Variable definitions
     */
    i_enter_x_in_the_y: function (vars, defs) {
        console.log("I enter x in the y");
        return [
            { "type": "get", "url": "http://aurin.org.au" }
        ];
    },

    /**
     * The user sets the browser location to X and clicks enter to navigate.
     * @param vars Variables
     * @param defs Variable definitions
     */
    i_navigate_to_x: function (vars, defs) {
        console.log("I navigate to x");
        return [
            { "type": "get", "url": "http://aurin.org.au/4" }
        ];
    }

};