import Point from "../../models/Point/Point.js";
import {LINE_ADD_POINT, LINE_GO, LINE_INPUT, WAY_HIDE, WAY_SHOW, LEVEL_NEXT} from "../single_components/Events.js";
import {LEVEL_EVENT, LEVEL_PREV} from "../single_components/Events";
import {LINE_FINISH_INPUT, STATE_CHANGE} from "./MultiplayerEvents";
import Multiplayer from "../Multiplayer";


export default class MultiplayerControl {
    constructor() {
        this._domElem = null;
    }

    init(game, domElem) {
        this._domElem = domElem;

        this._domElem.addEventListener("mousedown", (e) => {
            if (game.state !== Multiplayer.STATES.INPUTTING_LINE) {
                return;
            }

            game.emit(LINE_INPUT, this.mousePoint(e));
        });

        this._domElem.addEventListener("mousemove", (e) => {

            game.emit(LINE_ADD_POINT, this.mousePoint(e));
        });

        this._domElem.addEventListener("mouseleave", () => {
            game.emit(LINE_FINISH_INPUT);
        });

        this._domElem.addEventListener("mouseup", () => {
            game.emit(LINE_FINISH_INPUT);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "w") {
                game.emit(WAY_SHOW);
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.key === "w") {
                game.emit(WAY_HIDE);
            }
        });
        document.addEventListener("keypress", (e) => {
            if (e.key === "n") {
                game.emit(LEVEL_EVENT, LEVEL_NEXT);
            }
        });
        document.addEventListener("keypress", (e) => {
            if (e.key === "b") {
                game.emit(LEVEL_EVENT, LEVEL_PREV);
            }
        });
        document.addEventListener("keypress", (e) => {
            if (e.key === "d") {
                game.emit(STATE_CHANGE, Multiplayer.STATES.DISCONNECTED);
            }
            if (e.key === "i") {
                game.emit(STATE_CHANGE, Multiplayer.STATES.INPUTTING_LINE);
            }
            if (e.key === "g") {
                game.emit(STATE_CHANGE, Multiplayer.STATES.GAME_PROCESSING);
            }
            if (e.key === "l") {
                game.emit(STATE_CHANGE, Multiplayer.STATES.LEVEL_PREVIEW);
            }
        });


        this._domElem.addEventListener("touchstart", (e) => {
            if (game.state !== Multiplayer.STATES.INPUTTING_LINE) {
                return;
            }

            e.preventDefault();

            const touches = e.changedTouches;
            if (touches && touches.length > 0) {
                game.emit(LINE_INPUT, this.mousePoint(touches[0]));
            }
        });

        this._domElem.addEventListener("touchmove", (e) => {
            e.preventDefault();

            const touches = e.changedTouches;
            if (touches && touches.length > 0) {
                game.emit(LINE_ADD_POINT, this.mousePoint(touches[0]));
            }
        });

        this._domElem.addEventListener("touchend", (e) => {
            e.preventDefault();

            game.emit(LINE_FINISH_INPUT);
        });
    }

    mousePoint(event) {
        return new Point(
            event.pageX - this._domElem.offsetLeft,
            event.pageY - this._domElem.offsetTop
        );
    }
}
