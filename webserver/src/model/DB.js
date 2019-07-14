var config = require('../../config').database,
    database = require("../../database");

var con = database(config.host, config.port, config.user, config.password, config.database);

module.exports = {
    lastInsertId: function (end) {
        con.connect(function (err){
            if (err){
                end({
                    error: err
                });
            }
            else{
                con.query("SELECT LAST_INSERT_ID() as id", function (err, result, fields){
                    if (err){
                        end({
                            error: err
                        });
                    }
                    else{
                        end({
                            id: result[0].id
                        })
                    }
                });
            }
        });
    },
    query: function (sql, end) {
        con.connect(function (err) {
            if (err) {
                end({
                    error: err
                });
            }
            else {
                con.query(sql, function (err, result, fields) {
                    if (err) {
                        end({
                            error: err
                        });
                    }
                    else {
                        end({
                            result: result,
                            fields: fields
                        });
                    }
                });
            }
        });
    }
};