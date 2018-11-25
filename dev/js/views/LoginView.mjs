/**
 * @module views/LoginView
 */

import NavigationController from "../controllers/NavigationController.mjs";
import Router from "../modules/Router.mjs";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import FormController from "../controllers/FormController.mjs";
import LoginRegisterValidator from "../components/validators/LoginRegisterValidator.js";

/**
 * View of the "Login" page
 * @class LoginView
 * @extends BaseView
 */
export default class LoginView extends BaseView {
    /**
     * Creates view and renders it
     */
    constructor() {
        super();
        this._navigationController = new NavigationController();
        this._formController = new FormController("login", LoginRegisterValidator);

        this.render();
        this.registerEvents();

        Emitter.on("done-check-user-login", this.checkLogin.bind(this));
    }

    /**
     * Emits check login event and shows view
     * @return {undefined}
     */
    show() {
        Emitter.emit("check-user-login");

        super.show();
    }

    /**
     * Callback on checking login
     * @param {boolean} isLogin true is user is logged in
     * @return {undefined}
     */
    checkLogin(isLogin) {
        if (isLogin) {
            Emitter.emit("error", "You are already registered and even logged in!");
            Router.open("/");
        }
    }

    /**
     * Generates html and puts it to this.viewSection
     * @return {undefined}
     */
    render() {
        super.render();

        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "Login"});

        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "Sign up",
                    class: ["signup-page"],
                    href: "/signup",
                },
                {
                    content: "<-",
                    class: ["return"],
                    href: "/",
                }
            ]
        });

        this.viewSection.innerHTML += Handlebars.templates.UserForm({
            id: "login_form",
            commonError: "Wrong user or password",
            submitText: "Login",
            fields: [
                {
                    name: "username",
                    validationType: "validate_username",
                    type: "text",
                    placeholder: "Username",
                },
                {
                    name: "password",
                    validationType: "validate_password",
                    type: "password",
                    placeholder: "Password",
                }
            ]
        });
    }

    /**
     * Register events for NavigationController and FormController to handle
     * @return {undefined}
     */
    registerEvents() {
        this.viewSection.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));
        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback);
    }
}