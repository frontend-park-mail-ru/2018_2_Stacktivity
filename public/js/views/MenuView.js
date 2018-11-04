import BaseView from "./BaseView.js";
import NavigationController from "../controllers/NavigationController.mjs";
import Emitter from "../modules/Emitter.js";
import Router from "../modules/Router.mjs";
import AboutView from "./AboutView.mjs";

const linksLogin = {
    links: [
        {
            content: "About",
            class: ["medium", "sea_blue", "about_link"],
            href: `${Router.getPathTo(AboutView)}`,
        },
        {
            content: "Logout",
            class: ["small", "grey", "logout_link"],
            href: "/logout",
        },
        {
            content: "username", // вместо аватарки
            class: ["big", "red", "profile_link"],
            href: "/profile",
        }
    ]
};
const linksNoLogin = {
    links: [
        {
            content: "About",
            class: ["medium", "sea_blue", "about_link"],
            href: "/about",
        },
        {
            content: "Login",
            class: ["small", "green", "login_link"],
            href: "/login",
        },
        {
            content: "Sign up",
            class: ["big", "red", "signup_link"],
            href: "/signup",
        },
    ]
};

export default class MenuView extends BaseView {
    constructor() {
        super();
        Emitter.on("done-get-user", this.render.bind(this));
    }

    show() {
        Emitter.emit("get-user");
        super.show();
    }

    render(user) {
        super.render();
        this.viewSection.innerHTML += Handlebars.templates.Header();
        this._navigationController = new NavigationController();

        if (user.is_logged_in) {
            this.viewSection.innerHTML += Handlebars.templates.Nav({
                links: [
                    {
                        content: "About",
                        class: ["medium", "sea_blue", "about_link"],
                        href: `/about`,
                    },
                    {
                        content: "Logout",
                        class: ["small", "grey", "logout_link"],
                        href: "/logout",
                    },
                    {
                        content: `${user.username}`, // вместо аватарки
                        class: ["big", "red", "profile_link"],
                        href: "/profile",
                    }
                ]
            });

            // TODO можно вынести в темплейт

            // let profile_link = document.getElementById("profile_link"); // аватарка
            // if (user.avatar) {
            //     profile_link.innerHTML = `<span><img src="../${user.avatar}" class="avatar" /></span>`;
            // } else {
            //     profile_link.innerHTML = `<span>${user.username}</span>`;
            // }

        } else {
            this.viewSection.innerHTML += Handlebars.templates.Nav(linksNoLogin);
        }

        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback);

        this.viewSection.innerHTML += Handlebars.templates.Menu();

        Emitter.off("done-get-user", this.render.bind(this));
        // TODO подписаться на обновления модели
    }
}