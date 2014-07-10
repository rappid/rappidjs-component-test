'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('componentTest',
        'Starts a web server for running component tests again', function () {

            var options = this.options(this.data);
            var done = this.async();

            require('..')(options, function() {
                done();
            });

        });

};