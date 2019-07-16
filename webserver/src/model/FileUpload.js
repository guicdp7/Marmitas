const formidable = require('formidable'),
    App = require("../App"),
    config = require("../../config"),
    fs = require("fs");

class FileUpload{
    constructor(req, name){
        /* creating variables */
        this.req = req;
        this.name = name;
    }
    /* functions */
    upload(end){
        const self = this, 
            form = new formidable.IncomingForm();

        form.parse(self.req, (err, fields, files) => {
            if (err || !files[self.name]){
                end({
                    error: err || "file not found"
                });
            }
            else{
                self.fileName = files[self.name].name;
                self.oldPath = files[self.name].path;
                self.newPath = config.uploadsFolder + "/" + self.fileName;

                fs.rename(self.oldPath, self.newPath, (err) => {
                    if (err){
                        end({
                            error: err
                        });
                    }
                    else{
                        end({
                            path: self.newPath,
                            name: self.fileName,
                            extension: App.getExtension(self.fileName)
                        });
                    }
                });
            }
        });
    }
};

module.exports = FileUpload;