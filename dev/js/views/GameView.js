/**
 * @module views/GameView
 */

import BaseView from "./BaseView.js";
import WebSocks from "../modules/WS.js";
import NavigationController from "../controllers/NavigationController.mjs";
import FormController from "../controllers/FormController.mjs";
import Emitter from "../modules/Emitter.js";

/**
 * View of the game page
 * @class GameView
 * @extends BaseView
 */
export default class GameView extends BaseView {
    /**
     * Creates view and renders it
     */
    constructor() {
        super();
        this._navigationController = new NavigationController();
        this._formController = new FormController("game");
        this.render();
        this.registerEvents();

        Emitter.on("submit-data-game", WebSocks.send.bind(WebSocks), false);
    }

    /**
     * Generates html and puts it to this.viewSection
     * @return {undefined}
     */
    render() {
        super.render();

        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    "content": "main",
                    "class": ["grey", "tiny"],
                    "href": "/"
                }
            ]
        });

        this.viewSection.innerHTML += Handlebars.templates.UserForm({
            id: "form_form",
            submitText: "send",
            fields: [
                {
                    name: "message",
                    type: "text",
                    placeholder: "text",
                }
            ]
        });

        this.viewSection.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));
    }


    /**
     * Register events for NavigationController to handle
     * @return {undefined}
     */
    registerEvents() {
        this.viewSection.getElementsByClassName("navigation")[0].
            addEventListener("click", this._navigationController.keyPressedCallback);
    }
}