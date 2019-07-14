var nodeSession = require('node-session');

module.exports = function (req, res, end) {
    var session = new nodeSession({
        secret: new Date().getTime()
    });
    session.startSession(req, res, end);
};