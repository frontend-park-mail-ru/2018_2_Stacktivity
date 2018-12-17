/**
 * @module views/GameView
 */

import BaseView from "./BaseView.js";
import WebSocks from "../modules/WS.js";
import NavigationController from "../controllers/NavigationController.mjs";
import FormController from "../controllers/FormController.mjs";
import Emitter from "../modules/Emitter.js";
import {WSPathMultiplayer, WSPathSingleplayer} from "../config";
import Single from "../components/game/GameModes/Single.js";

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
        this._formController = new FormController("game");
        this._game = new Single();
        this.registerEvents();

        this._ws = new WebSocks("game");
        this._ws.connect(WSPathSingleplayer);

        this._players = {};

        Emitter.on("player-got-scores", (user) => {
            if (this._players.first.username === user.username) {
                this.viewSection.getElementsByClassName("js-player-first")[0].innerHTML = Handlebars.templates.GameHeaderStatus({user});
            } else {
                this.viewSection.getElementsByClassName("js-player-second")[0].innerHTML = Handlebars.templates.GameHeaderStatus({user});
            }
        }, false);

        Emitter.on("game-change-state", (message) => {
            message = {header: "lol", desc: "kek"};
            this.viewSection.getElementsByClassName("js-game-status")[0].innerHTML = Handlebars.templates.GameHeaderStatus({message: message});
        }, false);

        Emitter.on("player-left-game", (user) => {
            this.viewSection.getElementsByClassName("js-game-status")[0].innerHTML = Handlebars.templates.GameHeaderStatus({header: `${user.username} left game...`, desc: "You win!"});
        }, false);

        Emitter.on("level-passed", () => {
            //todo congrats
        }, false);

        Emitter.on("level-passed-mult", () => {
            //todo congrats
        }, false);

        Emitter.on("done-get-user", (user) => {
            this.setFirstPlayer(user);
        }, false);
    }

    setFirstPlayer(user) {
        this._players.first = {
            username: user.username,
            score: user.score
        };

        console.log("set user done");
        setTimeout(() => {
            console.log("enemy-commected emit");
            Emitter.emit("info", "Other player has connected");
            Emitter.emit("enemy-connected", {username: "ere", score: 12});
        }, 1000);

        Emitter.on("enemy-connected", (enemy) => {
                this._players.second = {
                    username: enemy.username,
                    score: enemy.score
                };

                this.render();
            }
        );
    }

    /**
     * Emits load event and shows view
     * @return {undefined}
     */
    show() {
        Emitter.emit("get-user");
        super.show();
    }

    renderGame() {
        const state = {
            mult: true,
            players: this._players,
        };

        this.viewSection.innerHTML = "";
        this.viewSection.innerHTML += Handlebars.templates.Game(state);

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
        canvas.style = "border-left: 4px solid #00000082;border-right: 3px solid #00000082;display: block;box-shadow: inset 0 0 20px #00000085;position: relative;background: #fff;";

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
        this.renderGame();
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