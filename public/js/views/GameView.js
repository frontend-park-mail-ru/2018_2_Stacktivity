import BaseView from "./BaseView.js";
import NavigationController from "../controllers/NavigationController.mjs";

export default class GameView extends BaseView {
    constructor() {
        super();
    }

    show() {
        super.show();
        this.render();
    }

    render() {
        super.render();

        this._navigationController = new NavigationController();

        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    "content": "main",
                    "class": ["grey", "tiny"],
                    "href": "/"
                }
            ]
        });

        this.viewSection.getElementsByClassName("navigation")[0].
            addEventListener("click", this._navigationController.keyPressedCallback);
    }
}