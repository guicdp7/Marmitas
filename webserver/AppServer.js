const http = require('http'),
    App = require('./src/App');

class AppServer{
    constructor(args) {
        /* creating variables */
        this.args = args;
        this.data = "?";
    }
    /* functions */
    startServer() {
        this.server = http.createServer();

        this.server.on("request", this.onRequest.bind(this));

        return this.server;
    }
    /* events */
    onRequest(req, res) {
        const app = new App(req, res);
    }
}

module.exports = AppServer;