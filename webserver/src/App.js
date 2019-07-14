module.exports = {
    getUrlParameter: function (name, link){
        var tmp = [], value = false;
        link.substr(link.indexOf("?") + 1).split("&").forEach(function (i) {
            tmp = i.split("=");
            if (decodeURIComponent(tmp[0]) === name) { value = decodeURIComponent(tmp[1]); }
        });
        return value;
    },
    bytesLength: function (str) {
        var escstr = encodeURIComponent(str);
        var binstr = escstr.replace(/%([0-9A-F]{2})/ig, function(match, hex) {
            var i = parseInt(hex, 16);
            return String.fromCharCode(i);
        });
        return binstr.length;
    }
};