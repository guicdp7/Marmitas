const App = require("../App"),
    Authentication = require("../model/Authentication");

class Login{
    constructor(app, end) {
        /* creating variables */
        this.app = app;

        /* post variables */
        this.username = App.getUrlParameter("username", app.data);
        this.password = App.getUrlParameter("password", app.data);
        
        this.auth = new Authentication(this.username, this.password);

        /* check login */
        this.auth.checkLogin(end);
    }
};

module.exports = Login;