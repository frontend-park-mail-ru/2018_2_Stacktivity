import {BaseView} from "BaseView.js";
import {NavigationComponent} from "../components/Nav/Nav.mjs";
import Emitter from "../modules/Emitter.js";


export default class MenuView extends BaseView {
    constructor() {
        super();
        this._navigationComponent = new NavigationComponent({root: this.viewSection});
        Emitter.on("done-get-user", this.render.bind(this));
    }

    render(user) {
        this.viewSection.innerHTML += Handlebars.templates.Header();

        if (user === {}) {
            this._navigationComponent.render("menu_auth");

            let profile_link = document.getElementById("profile_link"); // аватарка
            if (user.avatar) {
                profile_link.innerHTML =
                    `<span><img src="../${user.avatar}" class="avatar" /></span>`;
            } else {
                profile_link.innerHTML = `<span>${user.username}</span>`;
            }

        } else {
            this._navigationComponent.render("menu");
        }

        this.viewSection.innerHTML += Handlebars.templates.Menu();

        Emitter.off("done-get-user", this.render.bind(this));
        // подписаться на обновления модели
    }
}