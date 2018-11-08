/**
 * @module views/RegisterView
 */

import NavigationController from "../controllers/NavigationController.mjs";
import Router from "../modules/Router.mjs";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import FormController from "../controllers/FormController.mjs";
import LoginRegisterValidator from "../components/validators/LoginRegisterValidator.js";

/**
 * View of the "Signup" page
 * @class RegisterView
 * @extends BaseView
 */
export default class RegisterView extends BaseView {
    /**
     * Creates view and renders it
     */
    constructor() {
        super();
        this._navigationController = new NavigationController();
        this._formController = new FormController("signup", LoginRegisterValidator);

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

        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "Sign Up"});
        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "Login",
                    class: [
                        "circle_size_small",
                        "circle_color_green",
                        "navigation__circle_position_right-page",
                    ],
                    href: "/login",
                },
                {
                    content: "<-",
                    class: [
                        "circle_size_tiny",
                        "circle_color_grey",
                        "navigation__circle_position_return",
                    ],
                    href: "/",
                }
            ]
        });

        this.viewSection.innerHTML += Handlebars.templates.UserForm({
            id: "signup_form",
            commonError: "Several fixes is required",
            submitText: "Submit",
            fields: [
                {
                    name: "username",
                    validationType: "validate_username",
                    type: "text",
                    placeholder: "Username",
                    error: "Username must be bigger than 3 and less than 20 " +
                        "symbols and shouldn't contain anything bad"
                },
                {
                    name: "email",
                    validationType: "validate_email",
                    type: "email",
                    placeholder: "E-Mail",
                    error: "This is not an e-mail"
                },
                {
                    name: "password",
                    validationType: "validate_password",
                    type: "password",
                    placeholder: "Password",
                    error: "Password must be bigger than 6 and less than 36 symbols"
                },
                {
                    name: "password_repeat",
                    validationType: "validate_password_repeat",
                    type: "password",
                    placeholder: "Confirm password",
                    error: "Passwords do not match"
                },
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