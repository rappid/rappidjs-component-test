'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    _ = require('underscore'),
    fs = require('fs');

module.exports = function(options) {
    options = options || {};

    _.defaults(options, {
        port: 8080,
        host: 'localhost',
        testGroup: null,
        dir: 'webtest'
    });

    console.log(options);
    var webTestRoot = path.resolve(options.dir),
        root = __dirname;

    var app = express();

    // do not cache
    app.use(function (req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');

        next();
    });

    // serve all public directories

    var staticFiles = {
        "/": "public/index.html",
        "/container.html": "public/container.html",
        "/test/TestApplication.js": "public/test/TestApplication.js",

        "/lib/mocha.js": "node_modules/mocha/mocha.js",
        "/lib/mocha.css": "node_modules/mocha/mocha.css",
        "/lib/chai.js": "node_modules/chai/chai.js",
        "/lib/jquery.expect.js": "node_modules/jquery.expect/jquery.expect.js",
        "/lib/jquery.js": "public/lib/jquery-1.11.1.min.js"
    };

    console.log("\nregistering routes for component-tests");
    for (var route in staticFiles) {
        if (staticFiles.hasOwnProperty(route)) {
            (function(route) {
                console.log(route + " -> " + staticFiles[route]);

                app.get(route, function (req, res) {
                    res.sendfile(path.join(root, staticFiles[route]));
                });
            })(route);
        }
    }

    var publicPath = path.resolve('public');
    console.log("\nmaking the public directory available");
    console.log("public -> " + publicPath);
    app.use(express.static(publicPath));

    console.log("\nusing the following web test root");
    console.log(webTestRoot);
    app.use(express.static(webTestRoot, {
        maxAge: 0
    }));

    return http.createServer(app).listen(options.port);

};