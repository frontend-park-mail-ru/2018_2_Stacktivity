import {ADD_CIRCLE} from "./Events.js";
import Point from "./models/Point/Point.js";
import Circle from "./models/Circle/Circle.js";
import {defaultLevels} from "./configs/defaultLevels.js";

export default class Control {
    constructor() {
        this._domElem = null;
    }

    init(game, domElem) {
        this._domElem = domElem;

        this._domElem.addEventListener("click", (e) => {
            const data = {
                circle: new Circle(this.mousePoint(e), 30),
                color: "cyan",
                type: "goal"
            };
            game.emit(ADD_CIRCLE, data);
        });
    //     this._canvas.addEventListener("mousedown", function(e) {
    //         curve = new Curve(mousePoint(e, this),
    //             new Window(canvas.width, canvas.height));
    //
    //         inputting = true;
    //
    //         i = 1;
    //     });
    //     this._canvas.addEventListener("mousemove", function(e) {
    //         if (inputting) {
    //             const mPoint = mousePoint(e, this);
    //             if (!Point.equal(curve.lastPoint(), mPoint)) {
    //                 curve.addPoint(mPoint);
    //
    //                 i++;
    //             }
    //         }
    //     });
    //     this._canvas.addEventListener("mouseup", function(e){
    //         if (inputting) {
    //             const mPoint = mousePoint(e, this);
    //             if (!Point.equal(curve.lastPoint(), mPoint)) {
    //                 curve.addPoint(mPoint);
    //
    //                 i++;
    //             }
    //         }
    //
    //         inputting = false;
    //         curve.running = true;
    //
    //     });
     }

    mousePoint(event) {
        return new Point(
            event.pageX - this._domElem.offsetLeft,
            event.pageY - this._domElem.offsetTop
        );
    }
}


