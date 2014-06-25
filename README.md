# gherkin-seinterpreter

Compile Gherkin DSL into Selenium Interpreter compatible test case and test 
suite scripts.

Please note that the current implementation does not yet support all features 
of the Gherkin DSL.


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out 
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains 
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as 
install and use Grunt plugins. Once you're familiar with that process, you may 
install this plugin with this command:

```shell
npm install gherkin-seinterpreter --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile 
with this line of JavaScript:

```js
grunt.loadNpmTasks('gherkin-seinterpreter');
```

## The "gherkin_to_seinterpreter" task

### Overview
In your project's Gruntfile, add a section named `gherkin_to_seinterpreter` to
the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gherkin_to_seinterpreter: {
    your_target: {
      // Target-specific file options go here.
    },
  },
});
```

### Options

#### cwd
Type: `String`
Default value: `'.'`

File system path to the directory where we will search for .feature files.

#### src
Type: `Array or String`
Default value: `**/*.feature`

Globbing patterns used to match .feature files within the current working 
directory.

#### dest
Type: `String`

File system path to the directory where output files will be written. Files
will be written in the same folder hierarchy found in the current working
directory.

#### steps
Type: `String`

File system path to the step definition file. Step definitions must be a 
JavaScript file. See the test/fixtures/steps subdirectory for an example of a 
step definition file.

#### vars
Type: `Array or String`
Default value: `[]`

File system paths and globbing patterns used to locate variable definition 
files. Variable definition files may be in JSON, properties or JavaScript 
format. See the test/fixtures/variables subdirectory for examples.


### Usage Examples

```js
grunt.initConfig({
  gherkin_to_seinterpreter: {
    target: {
        cwd: 'path/to/source/',
        src: ['**/*.features', '!**/*.disabled.features'],
        dest: 'output/path',
        steps: 'path/to/steps.js',
        vars: [
            'path/to/var/definitions/**/*.js',
            'path/to/var/definitions/**/*.json',
            'path/to/var/definitions/**/*.properties'
        ]
    }
  }
});
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test 
your code using [Grunt](http://gruntjs.com/).


## Backlog

The following tasks are currently identified for future completion:

 * File naming by template
 * Updated and improved documentation with examples 
 * Fill in missing unit tests
