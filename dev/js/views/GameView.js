/**
 * @module views/GameView
 */

import BaseView from "./BaseView.js";
import WebSocks from "../modules/WS.js";
import NavigationController from "../controllers/NavigationController.mjs";
import FormController from "../controllers/FormController.mjs";
import Emitter from "../modules/Emitter.js";
import Single from "../components/game/GameModes/Single.js";
import {WSPathSingleplayer} from "../config";

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

        this._ws = new WebSocks("game");
        this._ws.connect(WSPathSingleplayer);

        Emitter.on("game-message", function (data) {
            if (data.event === 1) {
                Emitter.emit("info", "room found!");
            }
        }, false);

        this._players = {};

        Emitter.on("player_got_scores", (user) => {
            if (this._players.first.username === user.username) {
                this.viewSection.getElementsByClassName("js-user-first")[0].innerHTML = Handlebars.templates.GameHeaderStatus({user});
            } else {
                this.viewSection.getElementsByClassName("js-user-second")[0].innerHTML = Handlebars.templates.GameHeaderStatus({user});
            }
        });

        Emitter.on("player_draw_line", () => {
            this.viewSection.getElementsByClassName("js-game-status")[0].innerHTML = Handlebars.templates.GameHeaderStatus({message: "Send line..."});
        });

        Emitter.on("player_turn", () => {
            // todo who draws
        });

        Emitter.on("player_left_game", () => {
            // todo other win
        });

        Emitter.on("level_passed", () => {
            //todo congrats
        });

        Emitter.on("level_passed_mult", () => {
            //todo congrats
        });


    }

    renderGame(players) {
        this.viewSection.innerHTML = "";

        this.viewSection.addEventListener("submit", this._formController.callbackSubmit.bind(this._formController));
        this.viewSection.innerHTML += Handlebars.templates.Game(players);

        const height = window.innerHeight;
        const width = window.innerWidth;

        const canvas = document.createElement("canvas");

        if (width / height > 16 / 9) {
            canvas.width = height * 16 / 9;
            canvas.height = height;
        } else {
            canvas.height = width * 9 / 16;
            canvas.width = width;
        }

        canvas.id = "canvas-single";
        canvas.style = "border-left: 4px solid #00000082;border-right: 3px solid #00000082;display: block;box-shadow: 0 0 20px #00000085;position: relative;background: #fff;";

        this.viewSection.getElementsByClassName("js-canvas-wrapper")[0].appendChild(canvas);

        this._game.init(canvas, {width: canvas.width, height: canvas.height});
        this._game.start();
    }


    /**
     * Generates html and puts it to this.viewSection
     * @return {undefined}
     */
    render() {
        super.render();

        this.renderGame({first: {username: "sis", score: 303}, second: {username: "ere", score: 12}});
    }


    /**
     * Register events for NavigationController to handle
     * @return {undefined}
     */
    registerEvents() {
        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback);

        window.addEventListener("resize", () => {
            const height = window.innerHeight;
            const width = window.innerWidth;
            const canvas = document.getElementById("canvas-single");

            if (width / height > 16 / 9) {
                canvas.width = height * 16 / 9;
                canvas.height = height;

            } else {
                canvas.height = width * 9 / 16;
                canvas.width = width;
            }
        });
    }
}