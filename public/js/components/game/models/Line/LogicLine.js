import Line from "./Line.js";
import Point from "../Point/Point.js";
import {BaseLine} from "./Line.js";

export default class LogicLine extends Line {
    constructor(basePoint, window) {
        super(basePoint);

        this._window = window;
        this._originLine = null;
        this._inputting = true;
        this._isReversed = false;
    }

    get inputting() {
        return this._inputting;
    }

    set inputting(value) {
        this._inputting = value;

        if (!this._inputting) {
            this._originLine = this._beginLine.copy();
            this.constructEndLine();
        }
    }

    addPoint(point) {
        if (!this._inputting || Point.equal(point, this.lastPoint())) {
            return;
        }
        this._beginLine.addPoint(point);
    }

    lastPoint() {
        return this._beginLine.lastPoint();
    }

    step() {
        if (this._inputting) {
            return;
        }
        this._beginLine.currentPosition++;
        this._endLine.currentPosition++;

        if (this._beginLine._currentPosition === this._beginLine.size()) {
            this._beginLine = this._endLine.copy();
            this.constructEndLine();
        }
    }

    constructEndLine() {
        let points = this._originLine.copyPoints();
        if (this._isReversed) {
            points.forEach((item) => {
                item.x = -item.x;
            });
        }
        this._endLine = new BaseLine(this._beginLine.getRealPoint(this._beginLine.size() - 1), points);

        for (let i = 0; i < this._endLine.size(); i++) {
            if (this._endLine.getRealPoint(i).x <= 0 ||
                this._endLine.getRealPoint(i).x >= this._window.width) {
                this._isReversed = !this._isReversed;
                for (let j = i + 1; j < this._endLine.size(); j++) {
                    this._endLine.points[j].x = 2 * this._endLine.points[i].x - this._endLine.points[j].x;
                }
            }
        }
    }

    getLastLine() {
        if (this._inputting) {
            return;
        }
        const p1 = this._endLine.getRealPoint(this._endLine.currentPosition - 1) ||
            this._beginLine.getRealPoint(this._beginLine.size() - 1);
        const p2 = this._endLine.getRealPoint(this._endLine.currentPosition);
        return [p1, p2];
    }
}
