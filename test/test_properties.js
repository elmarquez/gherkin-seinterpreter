/**
 * gherkin-seinterpreter
 * https://github.com/elmarquez/gherkin-seinterpreter
 *
 * Copyright (c) 2014 Davis Marques
 * Licensed under the MIT license.
 */
'use strict';

/* jshint -W030 */
/* global describe, it */

var expect = require('chai').expect;
var grunt = require('grunt');
var properties = require('../tasks/properties');
var tmp = require('tmp');

// clean up temporary files and folders even if an uncaught exception occurs
tmp.setGracefulCleanup();

describe('properties', function () {

  var keys, map, path;

  describe('module', function () {
    it('should load', function () {
      expect(properties).to.be.defined;
    });
    it('should have one function', function () {
      keys = Object.keys(properties);
      expect(keys.length).to.equal(1);
    });
  });

  describe('load function', function () {
    path = 'test/fixtures/vars/properties/sample.properties';
    it('should load the properties file', function () {
      map = properties.load(path);
      expect(map).to.be.defined;
      keys = Object.keys(map);
      expect(keys.length).to.be.above(10);
    });
  });

});
