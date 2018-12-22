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
import Router from "../modules/Router.mjs";

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
        this.registerEvents();

        this._ws = new WebSocks("mult");

        this._players = {};
        this._players.first = null;

        Emitter.on("mult-player-got-scores", (user) => {
            if (this._players.first.username === user.username) {
                this.viewSection.getElementsByClassName("js-player-first")[0].innerHTML = Handlebars.templates.GameHeaderStatus({user});
            } else {
                this.viewSection.getElementsByClassName("js-player-second")[0].innerHTML = Handlebars.templates.GameHeaderStatus({user});
            }
        }, false);

        Emitter.on("mult-game-change-state", (message) => {
            message = {header: "lol", desc: "kek"};
            this.viewSection.getElementsByClassName("js-game-status")[0].innerHTML = Handlebars.templates.GameHeaderStatus({message: message});
        }, false);

        Emitter.on("mult-player-left-game", (user) => {
            this.viewSection.getElementsByClassName("js-game-status")[0].innerHTML = Handlebars.templates.GameHeaderStatus({
                header: `${user.username} left game...`,
                desc: "You win!"
            });
        }, false);

        Emitter.on("mult-render-game", () => {
            this.renderGame();
        }, false);

        Emitter.on("mult-enemy-connected", (enemy) => {
                this._players.second = {
                    username: enemy.username,
                    score: enemy.score
                };

                Emitter.emit("mult-render-game");
            }, false
        );

        Emitter.on("start-timer", (time) => {
            const timer = this.viewSection.getElementsByClassName("js-game-timer")[0];
            let iId = setInterval(function () {
                time -= 1000;
                if (time < 0) {
                    clearInterval(iId);
                } else {
                    timer.innerHTML = `${time / 1000}`;
                }
            }, 1000);
        }, false);

        Emitter.on("done-check-user-login", this.checkLogin.bind(this));
    }

    setFirstPlayer(user) {
        this._players.first = {
            username: user.username,
            score: user.score,
        };
    }

    /**
     * Emits load event and shows view
     * @return {undefined}
     */
    show() {
        super.show();

        if (this._players.first) {
            this._ws.connect(WSPathMultiplayer);
            this._game = new Multiplayer();

            this.viewSection.innerHTML = `
            <div class="game-loading">
                <img src="https://i.redd.it/u0tcjayept5z.gif" />
            </div>
        `;

            // setTimeout(() => {
            //     console.log("enemy-commected emit");
            //     Emitter.emit("info", "Other player has connected");
            //     Emitter.emit("mult-enemy-connected", {username: "ere", score: 12});
            // }, 10000);

            Emitter.emit("mult-enemy-connected", {username: "ere", score: 12});
        } else {
            Emitter.emit("check-user-login");
        }
    }

    /**
     * Callback on checking login
     * @param {boolean} isLogin true is user is logged in
     * @return {undefined}
     */
    checkLogin(isLogin) {
        if (!isLogin) {
            Emitter.emit("warn", "You must login to preform this action");
            Router.open("/");
        } else {
            if (!this._players.first) {
                Emitter.on("done-get-user", (user) => {
                    this.setFirstPlayer(user);
                    this.show();
                });

                Emitter.emit("get-user");
            }
        }
    }

    hide() {
        super.hide();

        this._ws.close();
        Emitter.wipe("mult-message");

        this.viewSection.innerHTML = "";
    }

    renderGame() {
        const state = {
            mult: true,
            players: this._players,
        };

        this.viewSection.innerHTML = Handlebars.templates.Game(state);

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

        canvas.id = "canvas-mult";
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
            const canvas = document.getElementById("canvas-mult");

            if (canvas) {
                if (width / height > 16 / 9) {
                    canvas.width = height * 16 / 9;
                    canvas.height = height;

                } else {
                    canvas.height = width * 9 / 16;
                    canvas.width = width;
                }
            }
        });
    }
}