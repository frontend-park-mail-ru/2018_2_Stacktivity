/**
 * @module views/MenuView
 */

import BaseView from "./BaseView.js";
import NavigationController from "../controllers/NavigationController.mjs";
import Emitter from "../modules/Emitter.js";

const linksNoLogin = {
    links: [
        {
            content: "About",
            class: ["about"],
            href: "/about",
        },
        {
            content: "Login",
            class: ["login"],
            href: "/login",
        },
        {
            content: "Sign up",
            class: ["signup"],
            href: "/signup",
        },
    ]
};

/**
 * View of the main menu page
 * @class MenuView
 * @extends BaseView
 */
export default class MenuView extends BaseView {
    /**
     * Creates view and renders it
     */
    constructor() {
        super();
        this._navigationController = new NavigationController();
        this.render();
        this.registerEvents();

        Emitter.on("done-get-user", this.renderNav.bind(this), false);
    }

    /**
     * Emits load event and shows view
     * @return {undefined}
     */
    show() {
        Emitter.emit("get-user");
        super.show();
    }

    /**
     * Generates html and puts it to this.viewSection
     * @return {undefined}
     */
    render() {
        super.render();

        this.viewSection.innerHTML += Handlebars.templates.Header();
        this.viewSection.innerHTML += Handlebars.templates.Nav();
        this.viewSection.innerHTML += Handlebars.templates.Menu();
    }

    /**
     * Render navigation
     * @param {Array} user Current user
     * @return {undefined}
     */
    renderNav(user) {
        if (user.is_logged_in) {
            this.viewSection.getElementsByClassName("navigation")[0].innerHTML = Handlebars.templates.NavList({
                links: [
                    {
                        content: "About",
                        class: ["about"],
                        href: `/about`,
                    },
                    {
                        content: "logout",
                        class: ["logout"],
                        href: "/logout",
                    },
                    {
                        content: `${user.username}`,
                        class: ["profile"],
                        href: "/profile",
                    }
                ]
            });

            // TODO вынести в темплейт
            // let profile_link = document.getElementById("profile_link"); // аватарка
            // if (user.avatar) {
            //     profile_link.innerHTML = `<span><img src="../${user.avatar}" class="avatar" /></span>`;
            // } else {
            //     profile_link.innerHTML = `<span>${user.username}</span>`;
            // }
        } else {
            this.viewSection.getElementsByClassName("js-multiplayer-link")[0].classList.add("main-menu__menu-link_not-login", "js-disabled-multiplayer");
            this.viewSection.getElementsByClassName("navigation")[0].innerHTML = Handlebars.templates.NavList(linksNoLogin);
        }
    }

    /**
     * Register events for NavigationController to handle
     * @return {undefined}
     */
    registerEvents() {
        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback);
    }
}