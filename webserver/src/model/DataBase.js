const config = require("../../config").database,
    mysql = require("mysql");

class DataBase{
    constructor(){
        /* creating variables */
        this.connection = mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database
        });
    }
    /* functions */
    lastInsertId(end){
        this.connection.query("SELECT LAST_INSERT_ID() as id", (err, result, fields) => {
            if (err) {
                end({
                    error: err
                });
            }
            else {
                end({
                    id: result[0].id
                })
            }
        });
    }
    query(sql, end = () => {}){
        this.connection.query(sql, function (err, result, fields) {
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
};

module.exports = DataBase;