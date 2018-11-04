import NavigationController from "../controllers/NavigationController.mjs";
import Router from "../modules/Router.mjs";
import {errorHandler} from "../misc.js";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import FormController from "../controllers/FormController.mjs";

export default class LoginView extends BaseView {
    constructor() {
        super();
        Emitter.on("done-get-user", this.render.bind(this), false);
    }

    show() {
        Emitter.emit("get-user");

        // место для загрузочной картинки!

        super.show();
    }

    render(user) {
        super.render();

        if (user.is_logged_in) {
            Emitter.off("done-get-user", this.render.bind(this));
            errorHandler("You are already registered and even logged in!");
            // Router.open("/");
            return;
        }

        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "Login"});

        this._navigationController = new NavigationController();
        this._formController = new FormController("login", true);

        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "Sign up",
                    class: ["big", "red", "page", "signup_link"],
                    href: "/signup",
                },
                {
                    content: "<-",
                    class: ["tiny", "grey", "return_link"],
                    href: "/",
                }
            ]
        });

        let content = document.createElement("main");
        content.classList.add("page_content");

        content.innerHTML += Handlebars.templates.UserForm({
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

        this.viewSection.appendChild(content);

        document.addEventListener("submit", function (event) {
            event.preventDefault();

            console.log("mh?")
        });


        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback);
        content.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));
    }
}