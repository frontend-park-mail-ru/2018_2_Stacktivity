/**
 * @module views/GameView
 */

import BaseView from "./BaseView.js";
import WebSocks from "../modules/WS.js";
import NavigationController from "../controllers/NavigationController.mjs";
import FormController from "../controllers/FormController.mjs";
import Emitter from "../modules/Emitter.js";
import {WSPathSingleplayer} from "../config";

/**
 * View of the game page
 * @class GameView
 * @extends BaseView
 */
export default class SingleGameView extends BaseView {
    /**
     * Creates view and renders it
     */
    constructor() {
        super();
        this._navigationController = new NavigationController();
        this._formController = new FormController("single");
        this.render();
        this.registerEvents();


        this._ws = new WebSocks("game");
        this._ws.connect(WSPathSingleplayer);

        Emitter.on("game-message", function (data) {
            if (data.event === 1) {
                Emitter.emit("info", "room found!");
            }
        }, false);
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
                    "content": "single",
                    "class": ["grey", "tiny"],
                    "href": "/"
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