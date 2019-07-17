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
    _configNavLinks(){
        if (this.user){
            this.navLinks.innerHTML = `
            <li>
                <a id="btNovaMarmita" href="javascript:;">Nova Marmita</a>
            </li>
            <li>
                <a id="btSair" href="javascript:;">Sair</a>
            </li>
            `;
            this.btNovaMarmita = $("#btNovaMarmita")[0];
            this.btSair = $("#btSair")[0];
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

        this.formLogin.addEventListener("submit", this.onFormLoginSubmit);

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
    onBtEntrarClick(){
        App.openModal("divLogin");
    }
    onFormLoginSubmit(e){
        e.preventDefault();
    }
    onDivModalClick(e){
        if (e.currentTarget == e.target){
            App.closeModal(this.id);
        }
    }
}