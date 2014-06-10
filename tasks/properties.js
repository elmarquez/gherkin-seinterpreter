/**
 * gherkin-seinterpreter
 * https://github.com/dmarques/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

var grunt = require('grunt');
var S = require('string');
var properties = require('tea-properties');

module.exports = {

    /**
     * Load the properties file into a namespaced map.
     * @param path
     * @returns {{}}
     */
    load: function (path) {
        // one or both of maven and grunt add escape characters to the properties
        // file, creating down stream parsing problems
        var data = grunt.file.read(path);
        var key, line, lines = S(data).lines(), map = {}, val;
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            if (!S(line).startsWith('#') && S(line).trim() !== '') {
                try {
                    line = S(line).trim().split('=');
                    key = line[0];
                    val = line[1];
                    if (!key || !val) {
                        continue;
                    }
                    // fix the escaped characters injected by maven and grunt
                    val = S(val).replace('\\:', ':').s;
                    properties.set(map, key, val);
                } catch (err) {
                    grunt.log.error('Could not set property: %s\n\n%s', line, err);
                }
            }
        }
        return map;
    }

};