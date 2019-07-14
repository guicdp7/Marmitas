var App = require("../App"),
    config = require('../../config').adminLogin,
    DB = require("../model/DB");

module.exports = function (username, password, end) {
    var returnData = {};

    returnData["status"] = true;

    if (username && password) {
        /* check if is admin */
        if (config.username == username && config.password == password) {
            returnData["user"] = config;
            returnData["type"] = "admin";
            end(returnData);
        }
        else {
            DB.query("SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'", function (result) {
                if (!result.error) {
                    if (result.result.length) {
                        returnData["user"] = result.result[0];
                        returnData["type"] = "user";
                    }
                    else {
                        returnData["error"] = "invalid login";
                        returnData["status"] = false;
                    }
                }
                else {
                    returnData["error"] = result.error;
                    returnData["status"] = false;
                }
                end(returnData);
            });
        }
    }
    else {
        returnData["error"] = "no data";
        returnData["status"] = false;
        end(returnData);
    }
};