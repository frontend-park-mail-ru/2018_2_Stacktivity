import NavigationController from "../controllers/NavigationController.mjs";
import {errorHandler} from "../misc.js";
import Router from "../modules/Router.mjs";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import FormController from "../controllers/FormController.mjs";

export default class ProfileView extends BaseView {
    constructor() {
        super();
        Emitter.on("done-get-user", this.render.bind(this));
    }

    show() {
        Emitter.emit("get-user");

        // место для загрузочной картинки!

        super.show()
    }

    render(user) {
        super.render();
        if (!user.is_logged_in) {
            errorHandler("no login"); // TODO error controller?
            Router.open("/");
            return;
        }

        this._formController = new FormController("profile");
        this._navController = new NavigationController();


        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "Profile"});
        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "<-",
                    class: ["tiny", "grey", "return_link"],
                    href: "/",
                }
            ]
        });

        let content = document.createElement("main");
        content.classList.add("page_content");
        content.innerHTML += Handlebars.templates.Profile(user);
        this.viewSection.appendChild(content);

        this.viewSection.addEventListener("click", this._navController.keyPressedCallback.bind(this._navController));
        content.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));
    }
}