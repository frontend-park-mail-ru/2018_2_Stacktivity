/**
 * @module views/GameView
 */

import BaseView from "./BaseView.js";
import WebSocks from "../modules/WS.js";
import NavigationController from "../controllers/NavigationController.mjs";
import FormController from "../controllers/FormController.mjs";
import Emitter from "../modules/Emitter.js";
import Game from "../components/game/Game.js";

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
        //this._navigationController = new NavigationController();
        this._formController = new FormController("game");
        this._game = new Game("single");
        this.render();
        //this.registerEvents();

        Emitter.on("submit-data-game", WebSocks.send.bind(WebSocks), false);
    }

    /**
     * Generates html and puts it to this.viewSection
     * @return {undefined}
     */
    render() {
        super.render();

        // this.viewSection.innerHTML += Handlebars.templates.Nav({
        //     links: [
        //         {
        //             "content": "main",
        //             "class": ["grey", "tiny"],
        //             "href": "/"
        //         }
        //     ]
        // });
        //
        // this.viewSection.innerHTML += Handlebars.templates.UserForm({
        //     id: "form_form",
        //     submitText: "send",
        //     fields: [
        //         {
        //             name: "message",
        //             type: "text",
        //             placeholder: "text",
        //         }
        //     ]
        // });

        this.viewSection.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));

        const canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.width = 1270;
        canvas.height = 720;
        canvas.style = "border: 1px solid; display: block;";

        this.viewSection.appendChild(canvas);

        this._game.init(canvas, {width: canvas.width, height: canvas.height});
        this._game.start();
    }


    /**
     * Register events for NavigationController to handle
     * @return {undefined}
     */
    // registerEvents() {
    //     this.viewSection.getElementsByClassName("navigation")[0].
    //         addEventListener("click", this._navigationController.keyPressedCallback);
    // }
}