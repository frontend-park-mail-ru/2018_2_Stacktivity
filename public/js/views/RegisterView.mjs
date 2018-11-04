import NavigationController from "../controllers/NavigationController.mjs";
import Router from "../modules/Router.mjs";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import {errorHandler} from "../misc.js";
import FormController from "../controllers/FormController.mjs";

/**
 * @function createSignUp
 * Draws the signup page
 */
export default class RegisterView extends BaseView {
    constructor() {
        super();
        Emitter.on("done-get-user", this.render.bind(this));
    }

    show() {
        Emitter.emit("get-user");

        // место для загрузочной картинки!

        super.show();
    }

    render(user) {
        super.render();

        if (user.is_logged_in) {
            errorHandler("You are already registered and even logged in!");

            return;
        }

        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "Sign Up"});

        this._navigationController = new NavigationController();
        this._formController = new FormController("signup", true);

        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "Login",
                    class: [ "small", "green", "page", "login_link" ],
                    href: "/login",
                },
                {
                    content: "<-",
                    class: [ "tiny", "grey", "return_link" ],
                    href: "/",
                }
            ]
        });


        let content = document.createElement("main");
        content.classList.add("page_content");

        content.innerHTML += Handlebars.templates.UserForm({
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

        this.viewSection.appendChild(content);

        content.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));
        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback);

        Emitter.off("done-get-user", this.render.bind(this));
    }
}