#! /usr/bin/env node
// Quick-and-dirty web server using Node.js
// Republic Of Techies (RoT) group project.
(function() {
    'use strict';

    var sys = require('sys');
    var http = require('http');
    var fs = require('fs');
    var path = require('path');
	var ledController = require('./ledController.js');
	var qs = require('querystring');
    var port = 8080;

    // Responds to normal requests with control over headers
    var respond = function(response, code, headers, data) {
        response.writeHeader(code, headers);
        response.write(data);
        response.end();
    };

    // Responds to error conditions using a file template
    var errorpage = function(response, code, url) {
        fs.readFile('errorpages/page' + code + '.html',
                    function(err, data) {
                        if (err)
                            throw err;
                        respond(response, code, {
                            'Content-Type': 'text/html'},
                                data.toString()
                                .replace(/:PATH:/g, url)); });
    };

    // Wrapper around HTTP response function that handles exceptions
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
        var s = url.replace(/[^\/a-zA-Z0-9._-]/g, '').split('/');
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
            return respond(response, 200, {
                "Context-Type": "text/plain",
                "Access-Control-Allow-Origin": "http://localhost"},
                           new Date().toString());
        }
		
		//Listener page for LED AJAX calls.  Added by KevinGage
		//Expects HTTP POST value called ledCommand
		if (url == '/LED') {
			if (request.method == 'POST') {
				var postData = '';
				request.on('data', function (data) {
					postData += data;

					// Too much POST data, kill the connection!
					if (postData.length > 1e6) {
						request.connection.destroy();
					}
				});
				request.on('end', function () {
					var post = qs.parse(postData);

					var ledCommand = post['ledCommand'].split("_");
					
					for (var i = 0; i < ledCommand.length; i++) {
						ledCommand[i] = JSON.parse(ledCommand[i]);
					}
					
					console.log("sending this command to led controller: " + ledCommand);
					
					ledController.LED(ledCommand, function (err) {
						//return respond(response, 200, {"Context-Type": "text/plain"},err);
						console.log("setting header");
						response.writeHeader(200, {'Content-Type': 'text/plain'});
						console.log("sending respsonse");
						response.write(err);
						console.log("ending response");
						response.end();
						console.log("returning");
						return "";
					});
				});
			}
		}

        // Otherwise unrecognized URLs are treated as file paths
        fs.readFile(path.join('.', url), function (err, data) {
            if (err) {
                if (err.code === 'ENOENT')
                    return errorpage(response, 404, url);
                else if (err.code === 'EACCES')
                    return errorpage(response, 403, url);
                else throw err;
            }

             // :TODO: determine content type --
            //   by file extension?
            //   by contents?
            //   a combination of both?
            return respond(response, 200, {
                'Content-Type': 'text/html'}, data);
        });
    })).listen(port);
    console.log('Server listening: http://localhost:' + port + '/');
})();
