var mysql = require("mysql");

module.exports = function (host, port, user, password, database) {
    var connection = mysql.createConnection({
        host: host,
        port: port,
        user: user,
        password: password,
        database: database
    });
    return connection;
};