import Game from "./Game";

import MultiplayerLogic from "./multiplayer_components/MultiplayerLogic";
import MultiplayerScene from "./multiplayer_components/MultiplayerScene";
import {LEVEL_LOAD} from "./single_components/Events";
import {DEFAULT_WINDOW, LEVEL_SHOW_TIME} from "../configs/config";
import {defaultLevels} from "../configs/defaultLevels";
import MultiplayerControl from "./multiplayer_components/MultiplayerControl";
import {
    CANVAS_RESIZE,
    LINE_ENEMY_CREATE, LINE_REFRESH,
    MULT_COMP_START,
    PLAYER_FAILURE,
    PLAYER_SUCCESS,
    SERVER_CONNECTED,
    SERVER_DATA_LOADED, SERVER_ENEMY_LEFT,
    SERVER_FINISH_GAME,
    SERVER_FINISH_INPUT,
    SERVER_INPUTTED_LINE,
    SERVER_LOADING,
    SERVER_PLAYER_FAILURE,
    SERVER_PLAYER_SUCCESS,
    SERVER_START_GAME,
    SERVER_START_INPUT,
    SERVER_STATUS_SUCCESS,
    STATE_CHANGE
} from "./multiplayer_components/MultiplayerEvents";
import Emitter from "../../../modules/Emitter";
import User from "../models/User/User";


export default class Multiplayer extends Game {
    constructor() {
        super("multiplayer");

        this._player = null;
        this._enemy = null;

        this._state = Multiplayer.STATES.WAITING_SERVER;

        this._logic = new MultiplayerLogic(this);
        this._scene = new MultiplayerScene(this);
        this._control = new MultiplayerControl();
    }

    static get STATES() {
        return {
            DISCONNECTED: "DISCONNECTED",
            WAITING_SERVER: "WAITING_SERVER",
            WAITING_PLAYERS: "WAITING_PLAYERS",
            PRESENTATION_PLAYERS: "PRESENTATION_PLAYERS",
            INPUTTING_LINE: "INPUTTING_LINE",
            GAME_PREVIEW: "GAME_PREVIEW",
            GAME_PROCESSING: "GAME_PROCESSING",
            END_SUCCESS: "END_SUCCESS",
            END_FAILURE: "END_FAILURE"
        };
    }

    init(canvas, {width, height}) {
        super.init({width, height});

        window.addEventListener("resize", () => {
            const height_ = window.innerHeight;
            const width_ = window.innerWidth;
            const canvas_ = document.getElementById("canvas-mult");

            let newH = height_;
            let newW = width_;

            if (canvas_) {
                if (width_ / height_ > 16 / 9) {
                    newW = height_ * 16 / 9;
                    newH = height_;

                    canvas.width = newW;
                    canvas.height = newH;
                } else {
                    newW = width_;
                    newH = width_ * 9 / 16;

                    canvas.width = newW;
                    canvas.height = newH;
                }
            }

            const newScale = width_ / DEFAULT_WINDOW.width;
            console.log("new scale: ", newScale);
            console.log("resize scale: ", newScale / this._scale);
            super.resize(newScale);
            this.emit(CANVAS_RESIZE, {newLevel: this._level, newScale: newScale});
            super.init({width: newW, height: newH});
        });

        this.on(STATE_CHANGE, this.changeState.bind(this), false);
        this.on(PLAYER_SUCCESS, Multiplayer.sendPlayerSuccess.bind(this));
        this.on(PLAYER_FAILURE, Multiplayer.sendPlayerFailure.bind(this), false);
        Emitter.on("mult-message", this.manageServer.bind(this), false);

        const ctx = canvas.getContext('2d');

        this._logic.init();
        this._scene.init(ctx);
        this._control.init(this, canvas);
    }

    start() {
        // this.setLevel(Multiplayer.loadLevel(3));
        // this.emit(LEVEL_LOAD, this._level);

        console.log("MULT_START");
        this.emit(MULT_COMP_START);
    }

    manageServer(data) {
        switch (data.event) {
            case SERVER_CONNECTED:
                this.changeState(Multiplayer.STATES.WAITING_PLAYERS);
                break;
            case SERVER_LOADING:
                this.setLevel(data.level);
                this._player = new User({nickname: data.players[0]});
                this._enemy = new User({nickname: data.players[1]});

                this.changeState(Multiplayer.STATES.PRESENTATION_PLAYERS);

                window.setTimeout(Emitter.emit.bind(Emitter), LEVEL_SHOW_TIME, "mult-send", {event: SERVER_DATA_LOADED});
                break;
            case SERVER_START_INPUT:
                this.emit(LEVEL_LOAD, this._level);
                this.emit(LINE_REFRESH);
                Emitter.emit("start-timer", 10000);

                this.changeState(Multiplayer.STATES.INPUTTING_LINE);
                break;
            case SERVER_FINISH_INPUT:
                // eslint-disable-next-line no-case-declarations
                let lineObj = null;
                if (this._logic._player.line) {
                    if (this._logic._player.line._inputting) {
                        console.log("Finish line ");
                        this._logic._player.line.finishLine();
                        console.log("Finish line 2");
                    }
                    lineObj = this._logic._player.line._originLine.makeJsonObj();
                    this.scaleLineToDefault(lineObj);
                }

                Emitter.emit("mult-send", {event: SERVER_INPUTTED_LINE, line: lineObj});
                break;
            case SERVER_START_GAME:
                this.scaleLineToCurrent(data.line);
                this.emit(LINE_ENEMY_CREATE, data.line);
                this.changeState(Multiplayer.STATES.GAME_PROCESSING);
                break;
            case SERVER_ENEMY_LEFT:
            case SERVER_FINISH_GAME:
                if (data.status === SERVER_STATUS_SUCCESS) {
                    this.changeState(Multiplayer.STATES.END_SUCCESS);
                } else {
                    this.changeState(Multiplayer.STATES.END_FAILURE);
                }
                Emitter.emit("mult-close");
        }
    }

    static loadLevel(num) {
        // fetch from server

        if (num < 0 || num > defaultLevels.length) {
            return;
        }
        return defaultLevels[num];
    }

    get state() {
        return this._state;
    }

    changeState(newState) {
        this._state = newState;
    }

    static sendPlayerSuccess() {
        console.log("PLAYER_SUCCESS");
        Emitter.emit("mult-send", {event: SERVER_PLAYER_SUCCESS});
    }

    static sendPlayerFailure() {
        console.log("PLAYER_FAILURE");
        Emitter.emit("mult-send", {event: SERVER_PLAYER_FAILURE});
    }

    scaleLineToDefault(jsonLine) {
        if (!jsonLine) {
            return;
        }

        jsonLine.base_point.x = Math.round(jsonLine.base_point.x / this._scale);
        jsonLine.base_point.y = Math.round(jsonLine.base_point.y / this._scale);

        jsonLine.points.forEach((point) => {
            point.x = Math.round(point.x / this._scale);
            point.y = Math.round(point.y / this._scale);
        });
    }

    scaleLineToCurrent(jsonLine) {
        if (!jsonLine) {
            return;
        }

        jsonLine.base_point.x = Math.round(jsonLine.base_point.x * this._scale);
        jsonLine.base_point.y = Math.round(jsonLine.base_point.y * this._scale);

        jsonLine.points.forEach((point) => {
            point.x = Math.round(point.x * this._scale);
            point.y = Math.round(point.y * this._scale);
        });
    }
}