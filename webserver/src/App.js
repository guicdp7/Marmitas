module.exports = {
    getUrlParameter: function (name, link){
        var tmp = [], value = false;
        link.substr(link.indexOf("?") + 1).split("&").forEach(function (i) {
            tmp = i.split("=");
            if (decodeURIComponent(tmp[0]) === name) { value = decodeURIComponent(tmp[1]); }
        });
        return value;
    }
};