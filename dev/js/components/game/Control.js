import Point from "./models/Point/Point.js";
import {LINE_ADD_POINT, LINE_GO, LINE_INPUT, WAY_HIDE, WAY_SHOW, LEVEL_NEXT} from "./Events.js";


export default class Control {
    constructor() {
        this._domElem = null;
    }

    init(game, domElem) {
        this._domElem = domElem;

        this._domElem.addEventListener("mousedown", (e) => {
            game.emit(LINE_INPUT, this.mousePoint(e));
        });

        this._domElem.addEventListener("mousemove", (e) => {
            game.emit(LINE_ADD_POINT, this.mousePoint(e));
        });

        this._domElem.addEventListener("mouseleave", () => {
            game.emit(LINE_GO);
        });

        this._domElem.addEventListener("mouseup", () => {
           game.emit(LINE_GO);
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
                game.emit(LEVEL_NEXT);
            }
        });

        this._domElem.addEventListener("touchstart", (e) => {
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

            game.emit(LINE_GO);
        });
    }

    mousePoint(event) {
        return new Point(
            event.pageX - this._domElem.offsetLeft,
            event.pageY - this._domElem.offsetTop
        );
    }
}
