#! /usr/bin/env node
// Quick-and-dirty web server using Node.js
// Republic Of Techies (RoT) group project.
var sys = require('sys');
var http = require('http');
var fs = require('fs');
var path = require('path');
var port = 8080;

http.createServer(function(request, response) {
    var url = request.url;
    if (url === '/')
        url = '/index.html';

    if (url === '/time') {
        response.writeHeader(200, {
            "Context-Type": "text/plain",
            "Access-Control-Allow-Origin": "http://localhost"});
        response.write(new Date().toString());
        response.end();
    }
    
    fs.readFile(path.join('.', url), function (err, data) {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile('page404.html', function(err, data) {
                    if (err)
                        throw err;
                    response.writeHeader(404, {
                        "Content-Type": "text/html"});
                    response.write(data.toString()
                                   .replace(/:PATH:/g, url));
                    response.end();
                });
            } else throw err;
        } else {
            // :TODO: determine content type --
            //   by file extension?
            //   by contents?
            //   a combination of both?
            response.writeHeader(200, {"Content-Type": "text/html"});
            response.write(data);
            response.end();
        }
    });
}).listen(port);
console.log('Server listening: http://localhost:' + port + '/');
