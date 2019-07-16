const config = require("../../config").adminLogin,
    DataBase = require("./DataBase");

class Authentication {
    constructor(username, password) {
        /* creating variables */
        this.username = username;
        this.password = password;
    }
    /* functions */
    checkLogin(end) {
        const returnData = {
            status: true
        };
        if (this.username && this.password) {
            /* check if is admin */
            if (this.username == config.username && config.password == config.password) {
                returnData["user"] = config;
                returnData["type"] = "admin";
                end(returnData);
            }
            else {
                var db = new DataBase();
                db.query(`SELECT * FROM users WHERE username='${username}' AND password='${password}'`, (result) => {
                    if (!result.error) {
                        if (result.result.length) {
                            returnData["user"] = result.result[0];
                            returnData["type"] = "user";
                        }
                        else {
                            returnData["error"] = "invalid login";
                            returnData.status = false;
                        }
                    }
                    else {
                        returnData["error"] = result.error;
                        returnData.status = false;
                    }
                    end(returnData);
                });
            }
        }
        else{
            returnData["error"] = "no data";
            returnData.status = false;
            end(returnData);
        }
    }
};

module.exports = Authentication;