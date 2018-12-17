import Line from "./Line.js";
import {LINE_WIDTH} from "../../configs/config";

export default class SceneLine extends Line {
    constructor(point) {
        super(point);

        this._showWay = false;
    }


    draw(context, scale, color) {
        color = color || "black";

        context.save();

        context.lineWidth = LINE_WIDTH * scale;
        context.lineCap = "round";
        context.lineJoin = "round";

        context.globalCompositeOperation = "lighter";

        if (this._showWay) {
            context.strokeStyle = "red";

            context.beginPath();

            for (let i = 0; i < this._beginLine.size(); i++) {
                let point = this._beginLine.getRealPoint(i);
                if (point) {
                    context.lineTo(point.x, point.y);
                }
            }

            context.beginPath();
            if (this._endLine) {
                for (let i = 0; i <= this._endLine.size(); i++) {
                    let point = this._endLine.getRealPoint(i);
                    if (point) {
                        context.lineTo(point.x, point.y);
                    }
                }
            }
            context.stroke();
        }

        context.strokeStyle = color;
        context.beginPath();

        for (let i = this._beginLine.currentPosition; i < this._beginLine.size(); i++) {
            let point = this._beginLine.getRealPoint(i);
            if (point) {
                context.lineTo(point.x, point.y);
            }
        }
        if (this._endLine) {
            for (let i = 0; i <= this._endLine.currentPosition; i++) {
                let point = this._endLine.getRealPoint(i);
                if (point) {
                    context.lineTo(point.x, point.y);
                }
            }
        }

        context.stroke();
        context.restore();
    }

    get showWay() {
        return this._showWay;
    }

    set showWay(value) {
        this._showWay = value;
    }
}
