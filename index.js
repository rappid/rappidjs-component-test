'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    _ = require('underscore'),
    fs = require('fs');

module.exports = function (options, log) {
    options = options || {};
    log = log || console.log;

    _.defaults(options, {
        port: 8080,
        host: 'localhost',
        testGroup: null,
        dir: 'webtest'
    });

    log(options);
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

        "/lib/mocha.js": "public/lib/mocha.js",
        "/lib/mocha.css": "public/lib/mocha.css",
        "/lib/chai.js": "public/lib/chai.js",
	    "/lib/jquery.expect.js": "public/lib/jquery.expect.min.js",
        "/lib/jquery.js": "public/lib/jquery-1.11.1.min.js",
        "/lib/jquery-fill.js": "public/lib/jquery-fill.js",
        "/lib/jquery-fill-select.js": "public/lib/jquery-fill-select.js",
        "/lib/jquery-mouse-events.js": "public/lib/jquery-mouse-events.js"
    };

    log("\nregistering routes for component-tests");
    for (var route in staticFiles) {
        if (staticFiles.hasOwnProperty(route)) {
            (function (route) {
                log(route + " -> " + staticFiles[route]);

                app.get(route, function (req, res) {
                    res.sendfile(path.join(root, staticFiles[route]));
                });
            })(route);
        }
    }

    var publicPath = path.resolve('public');
    log("\nmaking the public directory available");
    log("public -> " + publicPath);
    app.use(express.static(publicPath));

    log("\nusing the following web test root");
    log(webTestRoot);
    app.use(express.static(webTestRoot, {
        maxAge: 0
    }));

    return http.createServer(app).listen(options.port);

};
