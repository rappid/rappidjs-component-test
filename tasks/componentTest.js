'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('componentTest',
        'Starts a web server for running component tests again', function () {

            var options = this.options(this.data);
            var done = this.async(),
                page;

            var server = require('..')(options, grunt.log.debug);
            var url = "http://localhost:" + options.port;

            if (options.runOnPhantom === true) {
                var phantom = require('phantom');

                phantom.create(function (ph) {
                    ph.createPage(function (p) {
                        page = p;
                        page.open(url, function (status) {

                            if (status === "success") {
                                getTestResult(function(testResult) {
                                    ph.exit();

                                    if (testResult.failedTests.length === 0 &&
                                        testResult.errorTests.length === 0) {
                                        grunt.log.ok(testResult.passedTests.length + " tests passed.");

                                        server.close(function() {
                                            done();
                                        }) ;

                                    } else {

                                        [
                                            {
                                                message: "failed",
                                                tests: testResult.failedTests
                                            },
                                            {
                                                message: "errored",
                                                tests: testResult.errorTests
                                            }
                                        ]
                                        .forEach(function (obj) {
                                                if (obj.tests.length) {
                                                    grunt.log.error(obj.tests.length + " tests " + obj.message + ":");

                                                    obj.tests.forEach(function(test) {

                                                        if (obj.message === "errored") {
                                                            grunt.log.error("\t" + test.file +
                                                                (test.error ? ": " + test.error.message : ""))
                                                        } else {
                                                            grunt.log.error("\t" + test.title +
                                                                (test.err ? ": " + test.err.message || test.err : ""))
                                                        }

                                                    });
                                                }
                                        });

                                        server.close(function () {
                                            done(false);
                                        });

                                    }
                                });

                            } else {
                                server.close(function () {
                                    done(false);
                                });
                            }
                        });
                    });
                });
            } else {
                grunt.log.ok("Open " + url + " to run tests and see the result");
            }


            function getTestResult(callback) {
                checkStatus();

                function checkStatus() {
                    page.evaluate(function () {
                        return window.testsCompleted && window.testResults;
                    }, function(result) {
                        if (result) {
                            callback && callback(result);
                        } else {
                            setTimeout(checkStatus, 1000);
                        }
                    })
                }
            }

        });

};