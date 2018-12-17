/**
 * @module views/GameView
 */

import BaseView from "./BaseView.js";
import WebSocks from "../modules/WS.js";
import NavigationController from "../controllers/NavigationController.mjs";
import FormController from "../controllers/FormController.mjs";
import Emitter from "../modules/Emitter.js";
import {WSPathMultiplayer} from "../config";
import Multiplayer from "../components/game/game_modes/Multiplayer";

/**
 * View of the game page
 * @class GameView
 * @extends BaseView
 */
export default class MultGameView extends BaseView {
    /**
     * Creates view and renders it
     */
    constructor() {
        super();
        this._navigationController = new NavigationController();
        this._formController = new FormController("mult");

        this._game = new Multiplayer();

        this.render();
        this.registerEvents();

        this._ws = new WebSocks("mult");
        this._ws.connect(WSPathMultiplayer);

        Emitter.on("mult-message", function (data) {
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
                    "content": "mult",
                    "class": ["grey", "tiny"],
                    "href": "/"
                }
            ]
        });

        const canvas = document.createElement("canvas");
        canvas.id = "canvas-mult";
        canvas.width = window.innerWidth - 10;
        canvas.height = canvas.width * 9 / 16;
        canvas.style = "border-left: 5px solid black; border-right: 5px solid black; display: block;";

        document.body.style.overflow = "hidden";

        this.viewSection.appendChild(canvas);
        this._game.init(this._ws, canvas, {width: canvas.width, height: canvas.height});
        this._game.start();


//         this.viewSection.innerHTML += `
// <div id="chatblock" class="chatblock">
//     <a data-href="/chat">Open chat</a><br />
//
//     <a data-href="chat">Show chat</a>
//     <iframe class="chatblock__if" src="/chat" width="300px" height="500px"></iframe>
// </div>`;
//
//         this.viewSection.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));
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