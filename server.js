#! /usr/bin/env node
// Quick-and-dirty web server using Node.js
// Republic Of Techies (RoT) group project.
(function() {
    'use strict';

    var sys = require('sys');
    var http = require('http');
    var fs = require('fs');
    var path = require('path');
    var port = 8080;

    var respond = function(response, code, headers, data) {
        response.writeHeader(code, headers);
        response.write(data);
        response.end();
    };

    http.createServer(function(request, response) {
        var url = request.url;
        if (url === '/')
            url = '/index.html';

        if (url === '/time') {
            respond(response, 200, {
                "Context-Type": "text/plain",
                "Access-Control-Allow-Origin": "http://localhost"},
                    new Date().toString());
        }

        fs.readFile(path.join('.', url), function (err, data) {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.readFile(
                        'page404.html',
                        function(err, data) {
                            if (err)
                                throw err;
                            respond(response, 404, {
                                "Content-Type": "text/html"},
                                    data.toString()
                                    .replace(/:PATH:/g, url));
                        });
                } else throw err;
            } else {
                // :TODO: determine content type --
                //   by file extension?
                //   by contents?
                //   a combination of both?
                respond(response, 200, {
                    "Content-Type": "text/html"}, data);
            }
        });
    }).listen(port);
    console.log('Server listening: http://localhost:' + port + '/');
})();
