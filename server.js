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

    var errorpage = function(response, url, code) {
        fs.readFile('errorpages/page' + code + '.html',
                    function(err, data) {
                        if (err)
                            throw err;
                        respond(response, code, {
                            'Content-Type': 'text/html'},
                                data.toString()
                                .replace(/:PATH:/g, url)); });
    };

    var careful = function(fn) {
        return function(request, response) {
            try {
                fn.apply(this, arguments);
            } catch (ex) {
                respond(response, 500, {'Content-Type': 'text/html'},
                        ['<!DOCTYPE html>',
                         '<title>Internal Error</title>',
                         '<h1>Internal Error</h1>',
                         '<p>Oops!  Something went wrong.</p>']
                        .join('\n'));
                console.log(ex);
            }
        };
    };

    // Santize a URL.  There are NPM packages which do this kind of
    // thing better but this is more fun and security stakes are low.
    var urlify = function(url) {
        var result = [], index, pops = 0;
        var s = url.replace(/[^\/a-zA-Z0-9_-]/g, '').split('/');
        for (index = 0; index < s.length; ++index) {
            if (s[index] === '.')
                continue;
            else if (s[index] === '..')
                result.pop();
            else result.push(s[index]);
        }
        return result.join('/');
    };

    http.createServer(careful(function(request, response) {
        var url = urlify(request.url);
        if (url === '/')
            url = '/index.html';

        // Server implemented services
        if (url === '/time') {
            respond(response, 200, {
                "Context-Type": "text/plain",
                "Access-Control-Allow-Origin": "http://localhost"},
                    new Date().toString());
            return;
        }

        // Otherwise unrecognized URLs are treated as file paths
        fs.readFile(path.join('.', url), function (err, data) {
            if (err) {
                if (err.code === 'ENOENT')
                    errorpage(response, url, 404);
                else if (err.code === 'EACCES')
                    errorpage(response, url, 403);
                else throw err;
            } else {
                // :TODO: determine content type --
                //   by file extension?
                //   by contents?
                //   a combination of both?
                respond(response, 200, {
                    'Content-Type': 'text/html'}, data);
            }
        });
    })).listen(port);
    console.log('Server listening: http://localhost:' + port + '/');
})();
