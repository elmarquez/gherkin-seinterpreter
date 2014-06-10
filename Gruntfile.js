/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        availabletasks: {
            all: {
                options: {
                    filter: 'exclude',
                    tasks: []
                }
            },
            main: {
                options: {
                    filter: 'include',
                    tasks: ['availabletasks','compile','lint','gherkin_seinterpreter','test']
                }
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },
        clean: {
            tests: ['tmp/**/*']
        },
        copy: {
            tests: {
                files: [
                    {
                        cwd: 'test/fixtures/features',
                        expand: true,
                        src: ['**/*.feature'],
                        dest: 'tmp'
                    }
                ]
            }
        },
        gherkin_to_seinterpreter: {
            sample: {
                cwd: 'test/fixtures/features',
                src: [ 'sample.feature' ],
                dest: 'tmp',
                steps: 'test/fixtures/steps/steps1.js',
                vars: [
                    'test/fixtures/vars/json/advanced.json',
                    'test/fixtures/vars/sample.properties'
                ]
            },
            test: {
                cwd: 'test/fixtures/features',
                src: [
                    '**/*.feature',
                    '!**/*.invalid.feature'
                ],
                dest: 'tmp',
                steps: 'test/fixtures/steps/steps1.js',
                vars: [
                    'test/fixtures/vars/json/advanced.json',
                    'test/fixtures/vars/sample.properties'
                ]
            }
        },
        jshint: {
            all: ['Gruntfile.js','tasks/*.js','test/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'tap'
            },
            test: {
                src: ['test/test_*.js']
            }
        }
    });

    // load task plugins
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // define tasks
    grunt.registerTask('default', ['availabletasks:main']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('compile', ['gherkin_to_seinterpreter']);
    grunt.registerTask('test', ['clean','compile','simplemocha']);
};
