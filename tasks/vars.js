/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

/* jshint -W030 */

var Path = require('path');
var S = require('string');
var grunt = require('grunt');
var merge = require('object-merge');
var properties = require('./properties');
var tea = require('tea-properties');
var tinytim = require('tinytim');
var traverse = require('traverse');

/**
 * Variables for injection into Selenium Interpreter step commands.
 */
module.exports = {

    // the maximum number of resolution recursions allowed before we assume
    // that there is a cycle in the graph
    MAX_RECURSIONS: 50,

    /**
     * Load variable definitions from the specified source(s) into a map.
     * Variables may be specified in JSON, properties or JavaScript files.
     * @param src Path or paths to variable definition files.
     * @returns {*} Variables map.
     */
    load: function (src) {
        var data, i, map = {}, path, paths = grunt.file.expand(src);
        // Load each step definition file and merge it into the map.
        for (i = 0; i < paths.length; i++) {
            path = S(paths[i]);
            grunt.log.debug("Loading variable definitions from '%s'", path.s);
            if (path.endsWith('.js')) {
                data = module.exports.loadJavaScript(path.s);
                map = merge(data, map);
            } else if (path.endsWith('.json')) {
                data = grunt.file.readJSON(path.s);
                map = merge(data, map);
            } else if (path.endsWith('.properties')) {
                data = properties.load(path.s);
                map = merge(data, map);
            }
        }
        // Variable definitions may include placeholders. Resolve all
        // placeholders with values specified within the map itself.
        map = module.exports.resolveValues(map);
        // return results
        return map;
    },

    /**
     * Load JavaScript file.
     * @param path
     */
    loadJavaScript: function (path) {
        var src = Path.join(process.cwd(), path);
        return require(src);
    },

    // count of the number of recursions executed while processing the map
    recursions: 0,

    /**
     * Recursively resolve template placeholders within the map with values
     * from the map itself.
     * @param json JSON element
     * @param map Substitution map
     * @returns {{}} Map
     */
    resolve: function (json, map) {
        var i, key, sub, templates;
        if (module.exports.recursions++ >= module.exports.MAX_RECURSIONS) {
            // reset the count so that subsequent runs won't break
            module.exports.recursions = 0;
            throw new Error("Maximum number of recursions exceeded. There may be a cycle in the graph, involving node %s.", json);
        }
        // Look for nodes in the json object that are strings. These nodes may
        // contain template placeholders of the form {{variable.name}}. We need
        // to resolve the value of variable.name for each place holder. In some
        // cases, variable.name may resolve to another object that in turn also
        // contains a placeholder and must likewise be resolved.
        traverse(json).forEach(function (node) {
            if (this.isLeaf && typeof node === 'string') {
                // If the node contains a template placeholder of the form
                // {{variable.name}} then resolve that placeholder value.
                templates = node.match(module.exports.templatePattern);
                if (templates) {
                    for (i = 0; i < templates.length; i++) {
                        key = templates[i];
                        sub = tea.get(map, key);
                        if (sub) {
                            module.exports.resolve(sub, map);
                        } else {
                            grunt.log.error("Could not find property '%s' in the substitution map", key);
                        }
                    }
                }
                // @todo merge this block with the one above
                // Apply variable substitutions to all placeholders
                templates = node.match(module.exports.templatePattern);
                if (templates) {
                    for (i = 0; i < templates.length; i++) {
                        // get the substitution value
                        sub = tea.get(map, templates[i]);
                        // if the substitution value is a string, then execute
                        // a basic template substitution
                        if (typeof sub === 'string') {
                            sub = tinytim.render(node, map);
                            this.update(sub);
                        } else if (Array.isArray(sub)) {
                            grunt.log.error('Can not use an array as a substitution value on node %s', node);
                        } else if (typeof sub === 'object') {
                            grunt.log.error('Can not use an object as a substitution value on node %s', node);
                        } else if (typeof sub === 'function') {
                            // @todo tim supports the use of a function to generate a substitution value/map and should be enabled here
                            grunt.log.error('Can not use a function as a substitution value on node %s', node);
                        }
                    }
                }
            }
        });
        module.exports.recursions--;
        return json;
    },

    /**
     * Resolve template placeholders within the map recursively with values
     * from the map itself.
     * @param map Map
     */
    resolveValues: function (map) {
        grunt.log.debug('Resolving placeholder values');
        return module.exports.resolve(map, map);
    },

    // regex to match a placeholder template within a string
    templatePattern: /(?!\{{2})([\w|\d|.]+)(?=\}{2})/g

};
