var App = require("../App"),
    Auth = require("../model/Authentication");

module.exports = function (end, url, data, method, headers, req, res) {
    var username = App.getUrlParameter("username", data),
        password = App.getUrlParameter("password", data);

    Auth(username, password, function (result){
        end(result);
    });
};