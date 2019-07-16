const http = require('http'),
    config = require('../config'),
    parse = require('url').parse,
    FileHandler = require("./model/FileHandler");

class App {
    constructor(args) {
        /* creating variables */
        this.args = args;
        this.data = "?";
    }
    /* static functions */
    static bytesLength(text) {
        const escstr = encodeURIComponent(text);
        const binstr = escstr.replace(/%([0-9A-F]{2})/ig, function (match, hex) {
            let i = parseInt(hex, 16);
            return String.fromCharCode(i);
        });
        return binstr.length;
    }
    static getExtension(fileName) {
        return fileName.substr(fileName.lastIndexOf(".") + 1);
    }
    static getUrlParameter(name, link) {
        let tmp = [],
            value = false;

        link.substr(link.indexOf("?") + 1).split("&").forEach(function (i) {
            tmp = i.split("=");
            if (decodeURIComponent(tmp[0]) === name) { value = decodeURIComponent(tmp[1]); }
        });
        return value;
    }
    static firstLetterUpper(text) {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    }
    /* functions */
    startServer() {
        this.server = http.createServer();

        this.server.on("request", this.onRequest.bind(this));

        return this.server;
    }
    /* private functions */
    _error(err){
        this.res.writeHead(404);
        this.res.end();
    }
    _staticServer() {
        this.fullPath = config.staticFolder + this.fileName;
        var fh = new FileHandler(this.fullPath);
        fh.readFile(this._success.bind(this), this._error.bind(this));
    }
    _success(response, stringify = false) {
        const data = stringify ? JSON.stringify(response) : response;

        this.res.writeHead(200, {
            'Content-Type': config.types[this.extension] || 'text/plain',
            'Content-Length': App.bytesLength(data)
        });

        this.res.end(data);
    }
    _webServer() {
        const self = this,
            responseObj = {
            status: true
        };

        self.extension = "json";

        self.fileName = "/" + App.firstLetterUpper(self.fileName.substr(1));

        self.fullPath = "./controller" + self.fileName + ".js";

        const classObj = require(self.fullPath);

        const cobj = new classObj(self, (resData) => {
            responseObj[self.fileName.substr(1).toLowerCase()] = resData;
            self._success(responseObj, true);
        });
        try {
            const classObj = require(self.fullPath);

            const cobj = new classObj(self, (resData) => {
                responseObj[self.fileName.substr(1).toLowerCase()] = resData;
                self._success(responseObj, true);
            });
        }
        catch (e) {
            responseObj["error"] = 0;
            responseObj.status = false;
            self._success(responseObj, true);
        }
    }
    /* events */
    onRequest(req, res) {
        this.req = req;
        this.res = res;
        this.method = req.method;
        this.headers = req.headers;
        this.url = req.url;

        this.req.on("data", this.onData.bind(this));
        this.req.on("end", this.onEnd.bind(this));
    }
    onData(chunk) {
        this.data += chunk.toString();
    }
    onEnd() {
        this.fileName = parse(this.url).pathname;

        if (this.fileName == "/") {
            this.fileName = config.defaultIndex;
        }

        this.extension = App.getExtension(this.fileName);

        if (this.extension == this.fileName) {
            this._webServer();
        }
        else {
            this._staticServer();
        }
    }
};

module.exports = App;