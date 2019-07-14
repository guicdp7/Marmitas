var formidable = require('formidable'),
    config = require('./config'),
    fs = require('fs');

module.exports = function (req, name, end) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err){
            end({error: err});
        }
        else{
            var fileName = files[name].name;
            var oldPath = files[name].path,
                newPath = config.uploadsFolder + "/" + fileName;
    
            fs.rename(oldPath, newPath, function (err) {
                if (err){
                    end({error: err});
                }
                else{
                    end({
                        path: newPath,
                        name: fileName,
                        extension: fileName.substr(fileName.lastIndexOf(".") + 1)
                    });
                }
            });
        }
    });
};