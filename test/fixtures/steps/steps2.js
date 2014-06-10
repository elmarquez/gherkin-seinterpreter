/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

module.exports = {

    /**
     * A regex pattern to function map that is used to determine which
     * function should be called for a particular Gherkin statement.
     */
    _statement_patterns: {
        'just a test': 'just_a_test'
    },

    /**
     * A placeholder function for testing.
     * @param vars Variable names and/or values
     * @param defs Variable definitions
     */
    just_a_test: function (vars, defs) {
        return [];
    }

};