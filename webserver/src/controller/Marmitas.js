var formidable = require('formidable'),
    App = require("../App"),
    DB = require("../model/DB"),
    Auth = require("../model/Authentication"),
    fileupload = require("../../fileupload");

module.exports = function (end, url, data, method, headers, req, res) {
    var id = App.getUrlParameter("id", url),
        marmitaData = App.getUrlParameter("data", data),
        auth = App.getUrlParameter("auth", data),
        marmitasResult = [];

    if (marmitaData) {
        if (auth) {
            auth = JSON.parse(auth);
            Auth(auth.username, auth.password, function (result) {
                if (result.status) {
                    marmitaData = JSON.parse(marmitaData);

                    fileupload(req, "image", function (fileResult) {
                        if (!fileResult.error) {
                            var sqlFile = "INSERT INTO files (path, name, extension) VALUES ('" + fileResult.path + "', '" + fileResult.name + "', '" + fileResult.extension + "')";
                            DB.query(sqlFile, function (fileQueryResult) {
                                if (!fileQueryResult.error) {
                                    DB.lastInsertId(function (lastResult) {
                                        if (!lastResult.error) {
                                            var fileId = lastResult.id;

                                            var sql = "INSERT INTO products (name, description, price, quantity, image_id, discount, assigned_to) VALUES(";
                                            sql += "'" + marmitaData.name + "',";
                                            sql += "'" + marmitaData.description + "',";
                                            sql += marmitaData.price + ",";
                                            sql += marmitaData.quantity + ",";
                                            sql += fileId + ",";
                                            sql += marmitaData.discount + ",";
                                            sql += (result.type == "admin" ? "NULL" : result.user.id);

                                            BroadcastChannel.query(sql, function (resultMarmita) {
                                                if (!resultMarmita.error) {
                                                    DB.lastInsertId(function (lastResult) {
                                                        if (!lastResult.error) {
                                                            marmitasResult["id"] = lastResult.id;
                                                            marmitasResult["status"] = true;
                                                        }
                                                        else {
                                                            marmitasResult["error"] = resultMarmita.error;
                                                            marmitasResult["status"] = true;
                                                        }
                                                        end(marmitasResult);
                                                    });
                                                }
                                                else {
                                                    marmitasResult["error"] = resultMarmita.error;
                                                    marmitasResult["status"] = false;
                                                    end(marmitasResult);
                                                }
                                            });
                                        }
                                        else {
                                            marmitasResult["error"] = lastResult.error;
                                            marmitasResult["status"] = false;
                                            end(marmitasResult);
                                        }
                                    })
                                }
                                else {
                                    marmitasResult["error"] = fileQueryResult.error;
                                    marmitasResult["status"] = false;
                                    end(marmitasResult);
                                }
                            });
                        }
                        else {
                            marmitasResult["error"] = fileResult.error;
                            marmitasResult["status"] = false;
                            end(marmitasResult);
                        }
                    });
                }
                else {
                    marmitasResult["error"] = result.error;
                    marmitasResult["status"] = false;
                    end(marmitasResult);
                }
            });
        }
        else {
            returnData["error"] = "no authentication data";
            marmitasResult["status"] = false;
            end(marmitasResult);
        }
    }
    else {
        getMarmitas(end);
    }

    function getMarmitas(end) {
        var sql = "SELECT * FROM products p";

        sql += " LEFT JOIN files f ON f.id = p.image_id";
        sql += " LEFT JOIN products_ingredients pi ON pi.product_id = p.id";
        sql += " LEFT JOIN ingredients i ON i.id = pi.ingredient_id";

        if (id) {
            sql += " WHERE id=" + id;
        }

        DB.query(sql, function (result) {
            if (!result.error) {
                marmitasResult = result.result;
            }
            else{
                console.log(result.error);
            }
            end(marmitasResult);
        });
    };
};