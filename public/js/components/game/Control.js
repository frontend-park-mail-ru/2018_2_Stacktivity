import Point from "./models/Point/Point.js";
import {LINE_ADD_POINT, LINE_GO, LINE_INPUT} from "./Events.js";


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
     }

    mousePoint(event) {
        return new Point(
            event.pageX - this._domElem.offsetLeft,
            event.pageY - this._domElem.offsetTop
        );
    }
}
