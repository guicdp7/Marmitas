class App{
    constructor () {
        /* creating variables */
        this.name = "Marmitas";
        this.user = null;

        this._checkLogin();

        document.addEventListener("DOMContentLoaded", this.onDocLoad.bind(this));
    }
    /* static function */
    static openModal(id){
        $("#" + id).removeClass("inactive");
    }
    static closeModal(id){
        $("#" + id).addClass("inactive");
    }
    /* functions */
    _checkLogin(){
        let userData = sessionStorage.getItem(this.name + "thisUser");
        if (typeof userData == "string"){
            this.user = JSON.parse(userData);
            return true;
        }
        return false;
    }
    _setLogin(loginData){
        sessionStorage.setItem(this.name + "thisUser", JSON.stringify(loginData));
        this.user = loginData;
        this._configNavLinks();
    }
    _logout(){
        sessionStorage.removeItem(this.name + "thisUser");
        this.user = null;
        this._configNavLinks();
    }
    _configNavLinks(){
        if (this.user){
            this.navLinks.innerHTML = `
            <li>
                <h4> - Olá ${this.user.username}</h4>
            </li>
            <li>
                <a id="btNovaMarmita" href="javascript:;">Nova Marmita</a>
            </li>
            <li>
                <a id="btSair" href="javascript:;">Sair</a>
            </li>
            `;
            this.btNovaMarmita = $("#btNovaMarmita")[0];
            this.btSair = $("#btSair")[0];

            this.btNovaMarmita.addEventListener("click", this.onBtNovaMarmitaClick.bind(this));
            this.btSair.addEventListener("click", this.onBtSairClick.bind(this));
        }
        else{
            this.navLinks.innerHTML = `
            <li>
                <a id="btEntrar" href="javascript:;">Entrar</a>
            </li>
            `;
            this.btEntrar = $("#btEntrar")[0];
            this.btEntrar.addEventListener("click", this.onBtEntrarClick.bind(this));
        }
    }
    _getPageElements(){
        /* page elements */
        this.navLinks = $("#navLinks")[0];
        this.divLoader = $("#divLoader")[0];
        this.formLogin = $("#formLogin")[0];

        this.formLogin.addEventListener("submit", this.onFormLoginSubmit.bind(this));

        /* modals */
        $(".modal").on("click", this.onDivModalClick);
    }
    /* events */
    onDocLoad(){
        /* config app */
        this._getPageElements();
        this._configNavLinks();

        /* remove loader */
        $(this.divLoader).addClass("is-loaded");
        $(this.divLoader).removeClass("white");
    }
    onBtSairClick(){
        this._logout();
    }
    onBtEntrarClick(){
        App.openModal("divLogin");
    }
    onBtNovaMarmitaClick(){
        App.openModal("divMarmita");
    }
    onFormLoginSubmit(e){
        e.preventDefault();
        const self = this,
            loginError = (err) => {
                $(self.formLogin).addClass("invalid");
                console.log(err);
            };

        
        $(self).removeClass("invalid");

        const ajaxOptions = {
            url: "/login",
            dataType: "json",
            type: "POST",
            contentType: 'application/json',
            data: {
                username: self.formLogin.username.value,
                password: self.formLogin.password.value
            },
            processData: true,
            success: (data, textStatus, jQxhr) => {
                if (data.status){
                    const loginResult = data.login;
                    if (loginResult.status){
                        self._setLogin(loginResult.user);
                        App.closeModal("divLogin");
                    }
                    else{
                        loginError(loginResult.error);
                    }
                }
                else{
                    loginError(data.error);
                }
            },
            error: function(jqXhr, textStatus, errorThrown){
                loginError(errorThrown);
            }
        };
        
        $.ajax(ajaxOptions);
    }
    onDivModalClick(e){
        if (e.currentTarget == e.target){
            App.closeModal(this.id);
        }
    }
}