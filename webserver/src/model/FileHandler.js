const fs = require("fs");

class FileHandler{
    constructor(filePath){
        /* creating variables */
        this.filePath = filePath;
    }
    /* functions */
    readFile(onSuccess, onError = (err) => {}){
        fs.readFile(this.filePath, (err, data) => {
            if (err){
                onError(err);
            }
            else{
                onSuccess(data);
            }
        });
    }
};

module.exports = FileHandler;