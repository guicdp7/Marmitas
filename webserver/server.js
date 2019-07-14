var http = require('http'),
    session = require('./session'),
    config = require('./config'),
    fileHandler = require('./filehandler'),
    parse = require('url').parse,
    types = config.types,
    staticFolder = config.staticFolder,
    apiFolder = config.apiFolder,
    defaultIndex = config.defaultIndex,
    server;

module.exports = server = http.createServer();

server.on('request', onRequest);

function onRequest(req, res) {
    var data = "?";

    req.on('data', function (chunk) {
        data += chunk.toString();
    });

    var method = req.method,
        headers = req.headers,
        url = req.url;

    req.on('end', function () {
        var filename = parse(req.url).pathname,
            fullPath,
            extension;

        if (filename === '/') {
            filename = defaultIndex;
        }

        extension = filename.substr(filename.lastIndexOf('.') + 1);

        if (extension == filename) {
            session(req, req, function () {
                var responseObj = {};

                extension = "json";

                filename = filename.charAt(0) + filename.charAt(1).toUpperCase() + filename.substr(2).toLowerCase();
                fullPath = apiFolder + filename + ".js";

                try {
                    var classObj = require(fullPath);

                    classObj(function (resData) {
                        responseObj[filename.substr(1).toLowerCase()] = resData;
                        responseObj["status"] = true;
                        success(JSON.stringify(responseObj));
                    }, url, data, method, headers, req, res);
                }
                catch (e) {
                    responseObj["error"] = e;
                    responseObj["status"] = false;
                    success(JSON.stringify(responseObj));
                }
            });
        }
        else {
            fullPath = staticFolder + filename;
            fileHandler(fullPath, success, error);
        }

        function success(data) {
            res.writeHead(200, {
                'Content-Type': types[extension] || 'text/plain',
                'Content-Length': data.length
            });
            res.end(data);
        };

        function error(err) {
            res.writeHead(404);
            res.end();
        };
    });
}