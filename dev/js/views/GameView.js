/**
 * @module views/GameView
 */

import BaseView from "./BaseView.js";
import WebSocks from "../modules/WS.js";
import NavigationController from "../controllers/NavigationController.mjs";
import FormController from "../controllers/FormController.mjs";
import Emitter from "../modules/Emitter.js";
import Single from "../components/game/GameModes/Single.js";

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
        this._game = new Single();
        this.render();
        this.registerEvents();

        // Emitter.on("submit-data-game", WebSocks.send.bind(WebSocks), false);
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
                    "class": [
                        "circle_size_tiny",
                        "circle_color_grey",
                    ],
                    "href": "/"
                }
            ]
        });

        this.viewSection.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));

        const canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style = "display: block;";

        document.body.style.overflow = "hidden";

        this.viewSection.appendChild(canvas);

        this._game.init(canvas, {width: canvas.width, height: canvas.height});
        this._game.start();
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