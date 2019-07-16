const App = require("../App"),
    DataBase = require("../model/DataBase"),
    Authentication = require("../model/Authentication"),
    FileUpload = require("../model/FileUpload");

class Marmitas {
    constructor(app, end) {
        /* creating variables */
        this.app = app;
        this.db = new DataBase();
        this.fu = new FileUpload(app.req, "image");

        /* post variables */
        this.id = App.getUrlParameter("id", app.url);
        this.marmitaData = App.getUrlParameter("data", app.data);
        this.authData = App.getUrlParameter("auth", app.data);

        const self = this;

        if (self.marmitaData){
            const returnData = {
                status: true
            };

            self._checkLogin((loginData) => {
                if (loginData.status){
                    self.marmitaData = JSON.parse(self.marmitaData);

                    self.fu.upload((fileData) => {
                        if (!fileData.error){
                            self._saveImage(fileData, (fileId) => {
                                if (!fileId.error){
                                    self._saveMarmita(loginData, fileId, (marmitaId) => {
                                        if (!marmitaId.error){
                                            returnData["id"] = marmitaId;
                                        }
                                        else{
                                            returnData["error"] = marmitaId.error;
                                            returnData.status = false;
                                        }
                                        end(returnData);
                                    });
                                }
                                else{
                                    returnData["error"] = fileId.error;
                                    returnData.status = false;
                                    end(returnData);
                                }
                            });
                        }
                        else{
                            returnData["error"] = fileData.error;
                            returnData.status = false;
                            end(returnData);
                        }
                    });
                }
                else{
                    returnData["error"] = loginData.error;
                    returnData.status = false;
                    end(returnData);
                }
            });
        }
        else{
            self.getMarmitas(end);
        }
    }
    /* functions */
    _checkLogin(end){
        if (this.authData){
            this.authData = JSON.parse(this.authData);

            const auth = new Authentication(this.authData.username, this.authData.password);
            auth.checkLogin(end);
        }
        else{
            end({
                error: "no authentication data"
            });
        }
    }
    _saveImage(fileData, end){
        const sql = `
            INSERT INTO files (path, name, extension) 
            VALUES ('${fileData.path}', '${fileData.name}', '${fileData.extension}')
        `;
        this.db.query(sql, (result) => {
            if (!result.error){
                this.db.lastInsertId((last) => {
                    if (!last.error){
                        end(last.id);
                    }
                    else{
                        end({
                            error: last.error
                        });
                    }
                });
            }
            else{
                end({
                    error: result.error
                });
            }
        });
    }
    _saveMarmita(loginData, fileid, end){
        const self = this;
        const md = self.marmitaData;
        const sql = `
            INSERT INTO products (name, description, price, quantity, image_id, discount, assigned_to)
            VALUES (
                '${md.name}',
                '${md.description}',
                ${md.price},
                ${md.quantidy},
                ${fileid},
                ${md.discount},
                ${loginData.type == "admin" ? "NULL" : loginData.user.id}
            )
        `;

        self.db.query(sql, (result) => {
            if (!result.error){
                self.db.lastInsertId((last) => {
                    if (!last.error){
                        end(last.id);
                    }
                    else{
                        end({
                            error: last.error
                        });
                    }
                });
            }
            else{
                end({
                    error: result.error
                });
            }
        });
    }
    getMarmitas(end) {
        let marmitasResult = {};
        const sql = `
            SELECT * FROM products p
            LEFT JOIN files f ON f.id = p.image_id
            LEFT JOIN products_ingredients pi ON pi.product_id = p.id
            LEFT JOIN ingredients i ON i.id = pi.ingredient_id
            ${this.id ?
                `WHERE id=${this.id}`
                : ""}
        `;
        this.db.query(sql, (result) => {
            if (!result.error) {
                marmitasResult = result.result;
            }
            else {
                console.log(result.error);
            }
            end(marmitasResult);
        });
    }
}

module.exports = Marmitas;