/**
 * @module views/ProfileView
 */
import NavigationController from "../controllers/NavigationController.mjs";
import Router from "../modules/Router.mjs";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import FormController from "../controllers/FormController.mjs";

/**
 * View of the "Profile" page
 * @class ProfileView
 * @extends BaseView
 */
export default class ProfileView extends BaseView {
    /**
     * Creates view and renders it
     */
    constructor() {
        super();
        this._formController = new FormController("profile");
        this._navigationController = new NavigationController();

        this.render();
        this.registerEvents();

        Emitter.on("done-get-user", this.renderProfile.bind(this));
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
            Emitter.emit("get-user");
        } else {
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
        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "Profile"});
        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "<-",
                    class: [
                        "circle_size_tiny",
                        "circle_color_grey",
                        "return_link",
                    ],
                    href: "/",
                }
            ]
        });

        this._content = document.createElement("main");
        this._content.classList.add("page_content");
        this.viewSection.appendChild(this._content);
    }

    /**
     * Renders profile form
     * @param {Object} user current user
     * @return {undefined}
     */
    renderProfile(user) {
        this._content.innerHTML = Handlebars.templates.Profile(user);
    }

    /**
     * Register events for NavigationController and FormController to handle
     * @return {undefined}
     */
    registerEvents() {
        this.viewSection.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));
        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback.bind(this._formController));
    }
}